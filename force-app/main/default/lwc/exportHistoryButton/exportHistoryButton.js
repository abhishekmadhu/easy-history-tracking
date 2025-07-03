import { LightningElement, api } from 'lwc';
import getHistoryTrackingInfo from '@salesforce/apex/ExportHistoryTrackingController.getHistoryTrackingInfo';

export default class ExportHistoryButton extends LightningElement {
    @api selectedObjectMap = {};
    @api fileName = 'history_tracking.csv';
    exportData = [];

    async handleExport() {
        // Get selected object API names from selectedObjectMap
        const selectedApiNames = Object.keys(this.selectedObjectMap || {}).filter(apiName => this.selectedObjectMap[apiName]);
        if (!selectedApiNames.length) {
            // No selection, do nothing
            return;
        }
        try {
            // Fetch export data for selected objects
            this.exportData = await getHistoryTrackingInfo({ objectApiNames: selectedApiNames });
        } catch (e) {
            this.exportData = [];
        }
        if (!this.exportData.length) {
            // No data to export
            return;
        }
        const header = ['Object Label', 'Object API Name', 'Field Label', 'Field API Name', 'History Tracking?'];
        const csvRows = [header.join(',')];
        this.exportData.forEach(row => {
            csvRows.push([
                '"' + (row.objectLabel || '') + '"',
                '"' + (row.objectApiName || '') + '"',
                '"' + (row.fieldLabel || '') + '"',
                '"' + (row.fieldApiName || '') + '"',
                row.historyTracking ? 'true' : 'false'
            ].join(','));
        });
        const csvString = csvRows.join('\n');
        // Use text/plain for Lightning Web Security compatibility
        const blob = new Blob([csvString], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }
}
