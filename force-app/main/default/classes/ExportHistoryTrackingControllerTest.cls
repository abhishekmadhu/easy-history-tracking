@isTest
public class ExportHistoryTrackingControllerTest {
    @isTest
    static void testGetHistoryTrackingInfo() {
        Test.startTest();
        List<ExportHistoryTrackingController.HistoryTrackingInfo> result = ExportHistoryTrackingController.getHistoryTrackingInfo();
        Test.stopTest();
        System.assert(result != null, 'Result should not be null');
        System.assert(result.size() > 0, 'There should be at least one field returned');
        ExportHistoryTrackingController.HistoryTrackingInfo sample = result[0];
        System.debug(sample);
        System.assertNotEquals(null, sample.objectLabel, 'Object label should not be null');
        System.assertNotEquals(null, sample.objectApiName, 'Object API name should not be null');
        System.assertNotEquals(null, sample.fieldLabel, 'Field label should not be null');
        System.assertNotEquals(null, sample.fieldApiName, 'Field API name should not be null');
        // historyTracking is a Boolean, so just check for not null
        System.assertNotEquals(null, sample.historyTracking, 'History tracking should not be null');
    }
    @isTest
    static void testGetHistoryTrackingInfoForAccount() {
        List<String> objectApiNames = new List<String>{'Account'};
        Test.startTest();
        List<ExportHistoryTrackingController.HistoryTrackingInfo> result = ExportHistoryTrackingController.getHistoryTrackingInfoForObjects(objectApiNames);
        Test.stopTest();
        System.assert(result != null, 'Result should not be null');
        System.assert(result.size() > 0, 'There should be at least one field returned');
        // Check that only Name and AccountNumber are tracked
        Set<String> trackedFields = new Set<String>();
        for (ExportHistoryTrackingController.HistoryTrackingInfo info : result) {
            if (info.historyTracking) {
                trackedFields.add(info.fieldApiName);
            }
        }
        System.assert(trackedFields.contains('Name'), 'Name should be tracked');
        System.assert(trackedFields.contains('AccountNumber'), 'AccountNumber should be tracked');
        System.assertEquals(2, trackedFields.size(), 'Only Name and AccountNumber should be tracked');
    }
}
