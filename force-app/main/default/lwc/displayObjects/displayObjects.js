import { LightningElement, wire, track } from 'lwc';
import getAllObjects from '@salesforce/apex/DisplayObjectsController.getAllObjects';
import getHistoryTrackingInfo from '@salesforce/apex/ExportHistoryTrackingController.getHistoryTrackingInfo';

export default class DisplayObjects extends LightningElement {
    @track objects = [];
    @track filteredObjects = [];
    @track error;
    @track sortBy = 'label';
    @track sortDirection = 'asc';
    @track filterText = '';
    @track isLoading = true;

    // For export button
    @track exportData = [];

    // Fetch field-level data only for export, not for UI
    async handleExportHistory() {
        try {
            const result = await getHistoryTrackingInfo();
            this.template.querySelector('c-export-history-button').exportData = result;
            this.template.querySelector('c-export-history-button').handleExport();
        } catch (e) {
            // Optionally handle error
        }
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
    }
}