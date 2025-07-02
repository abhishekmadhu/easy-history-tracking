@isTest
public class DisplayObjectsControllerTest {
    @isTest
    static void testGetAllObjects() {
        Test.startTest();
        List<DisplayObjectsController.SObjectInfo> objects = DisplayObjectsController.getAllObjects();
        Test.stopTest();
        System.assert(objects != null, 'Returned list should not be null');
        System.assert(objects.size() > 0, 'There should be at least one object in the org');
        Boolean foundAccount = false;
        for (DisplayObjectsController.SObjectInfo obj : objects) {
            if (obj.apiName == 'Account') {
                foundAccount = true;
                System.assertEquals('Account', obj.label, 'Account label should match');
            }
        }
        System.assert(foundAccount, 'Account object should be present in the org');
    }
}
