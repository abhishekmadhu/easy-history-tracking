import { LightningElement, wire, track } from 'lwc';
import getAllObjects from '@salesforce/apex/DisplayObjectsController.getAllObjects';
import getHistoryTrackingInfo from '@salesforce/apex/ExportHistoryTrackingController.getHistoryTrackingInfo';

export default class DisplayObjects extends LightningElement {
    @track objects = [];
    @track filteredObjects = [];

    // Returns filteredObjects with a .selected property for template use
    get filteredObjectsWithSelection() {
        return this.filteredObjects.map(obj => ({
            ...obj,
            selected: !!this.selectedObjectMap[obj.apiName]
        }));
    }
    @track error;
    @track sortBy = 'label';
    @track sortDirection = 'asc';
    @track filterText = '';
    @track isLoading = true;

    // Selection state
    @track selectedObjectMap = {};
    @track allSelected = false;

    // For export button
    @track exportData = [];

    // (Replaced by async versions below)

    // updateAllSelected() {
    //     // If all filtered objects are selected, set allSelected true
    //     this.allSelected = this.filteredObjects.length > 0 && this.filteredObjects.every(obj => this.selectedObjectMap[obj.apiName]);
    // }

    // Keep exportData in sync with selection for export button
    async updateExportData() {
        const selectedApiNames = Object.keys(this.selectedObjectMap).filter(apiName => this.selectedObjectMap[apiName]);
        if (selectedApiNames.length === 0) {
            this.exportData = [];
            return;
        }
        try {
            const result = await getHistoryTrackingInfo({ objectApiNames: selectedApiNames });
            this.exportData = result;
        } catch (e) {
            this.exportData = [];
        }
    }

    // Update exportData whenever selection changes
    async handleSelectObject(event) {
        const apiName = event.target.dataset.id;
        this.selectedObjectMap = { ...this.selectedObjectMap, [apiName]: event.target.checked };
        // this.updateAllSelected();
        // await this.updateExportData();
    }

    async handleSelectAll(event) {
        const checked = event.target.checked;
        const newMap = {};
        this.filteredObjects.forEach(obj => {
            newMap[obj.apiName] = checked;
        });
        this.selectedObjectMap = newMap;
        this.allSelected = checked;
        // await this.updateExportData();
    }

    @wire(getAllObjects)
    wiredObjects({ error, data }) {
        this.isLoading = false;
        if (data) {
            this.objects = data;
            this.applyFilterAndSort();
            this.error = undefined;
        } else if (error) {
            this.error = error.body ? error.body.message : error.message;
            this.objects = [];
            this.filteredObjects = [];
        }
    }

    get sortByIsLabel() {
        return this.sortBy === 'label';
    }

    get sortByIsApiName() {
        return this.sortBy === 'apiName';
    }

    get sortIcon() {
        return this.sortDirection === 'asc' ? 'utility:arrowup' : 'utility:arrowdown';
    }

    handleSort(event) {
        const field = event.target.dataset.field;
        if (this.sortBy === field) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortBy = field;
            this.sortDirection = 'asc';
        }
        this.applyFilterAndSort();
    }

    handleFilterChange(event) {
        this.filterText = event.target.value;
        this.applyFilterAndSort();
    }

    applyFilterAndSort() {
        let filtered = this.objects;
        if (this.filterText) {
            const filter = this.filterText.toLowerCase();
            filtered = filtered.filter(obj =>
                (obj.apiName && obj.apiName.toLowerCase().includes(filter)) ||
                (obj.label && obj.label.toLowerCase().includes(filter))
            );
        }
        filtered = [...filtered].sort((a, b) => {
            let valA = a[this.sortBy] ? a[this.sortBy].toLowerCase() : '';
            let valB = b[this.sortBy] ? b[this.sortBy].toLowerCase() : '';
            if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
            if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
        this.filteredObjects = filtered;
        // Keep selection in sync with filtered list
        const newMap = { ...this.selectedObjectMap };
        filtered.forEach(obj => {
            if (!(obj.apiName in newMap)) {
                newMap[obj.apiName] = false;
            }
        });
        // Remove selections for objects not in filtered list
        Object.keys(newMap).forEach(apiName => {
            if (!filtered.some(obj => obj.apiName === apiName)) {
                delete newMap[apiName];
            }
        });
        this.selectedObjectMap = newMap;
        // this.updateAllSelected();
    }
}