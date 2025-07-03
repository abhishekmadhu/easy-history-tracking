import { createElement } from 'lwc';
import ExportHistoryButton from 'c/exportHistoryButton';

jest.mock('@salesforce/apex/ExportHistoryTrackingController.getHistoryTrackingInfo', () => {
    return {
        default: jest.fn()
    };
}, { virtual: true });

import getHistoryTrackingInfo from '@salesforce/apex/ExportHistoryTrackingController.getHistoryTrackingInfo';

describe('c-export-history-button', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        jest.clearAllMocks();
    });

    it('does nothing if no objects are selected', async () => {
        const element = createElement('c-export-history-button', {
            is: ExportHistoryButton
        });
        element.selectedObjectMap = {};
        document.body.appendChild(element);
        // Simulate click
        const button = element.shadowRoot.querySelector('lightning-button');
        await button.click();
        expect(getHistoryTrackingInfo).not.toHaveBeenCalled();
    });

    it('calls Apex and downloads CSV for selected objects', async () => {
        const mockData = [
            {
                objectLabel: 'Account',
                objectApiName: 'Account',
                fieldLabel: 'Name',
                fieldApiName: 'Name',
                historyTracking: true
            }
        ];
        getHistoryTrackingInfo.mockResolvedValue(mockData);
        const element = createElement('c-export-history-button', {
            is: ExportHistoryButton
        });
        element.selectedObjectMap = { Account: true };
        document.body.appendChild(element);
        // Mock URL and anchor
        const createObjectURL = jest.fn(() => 'blob:url');
        const revokeObjectURL = jest.fn();
        window.URL.createObjectURL = createObjectURL;
        window.URL.revokeObjectURL = revokeObjectURL;
        const appendChild = jest.spyOn(document.body, 'appendChild');
        const removeChild = jest.spyOn(document.body, 'removeChild');
        // Simulate click
        const button = element.shadowRoot.querySelector('lightning-button');
        await button.click();
        // Wait for async
        await Promise.resolve();
        expect(getHistoryTrackingInfo).toHaveBeenCalledWith({ objectApiNames: ['Account'] });
        expect(createObjectURL).toHaveBeenCalled();
        expect(appendChild).toHaveBeenCalled();
        expect(removeChild).toHaveBeenCalled();
    });

    it('does not download if Apex returns empty', async () => {
        getHistoryTrackingInfo.mockResolvedValue([]);
        const element = createElement('c-export-history-button', {
            is: ExportHistoryButton
        });
        element.selectedObjectMap = { Account: true };
        document.body.appendChild(element);
        // Simulate click
        const button = element.shadowRoot.querySelector('lightning-button');
        await button.click();
        // Wait for async
        await Promise.resolve();
        expect(getHistoryTrackingInfo).toHaveBeenCalled();
        // No download should be triggered
    });
});
