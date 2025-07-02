public with sharing class DisplayObjectsController {
    @AuraEnabled(cacheable=true)
    public static List<SObjectInfo> getAllObjects() {
        List<SObjectInfo> objects = new List<SObjectInfo>();
        try {
            Map<String, Schema.SObjectType> gd = Schema.getGlobalDescribe();
            for (String key : gd.keySet()) {
                Schema.DescribeSObjectResult describe = gd.get(key).getDescribe();
                SObjectInfo info = new SObjectInfo();
                info.apiName = key;
                info.label = describe.getLabel();
                objects.add(info);
            }
            objects.sort(); // Sort by label (see Comparable below)
            return objects;
        } catch (Exception e) {
            throw new AuraHandledException('Failed to fetch objects: ' + e.getMessage());
        }
    }

    public class SObjectInfo implements Comparable {
        @AuraEnabled public String apiName;
        @AuraEnabled public String label;
        public Integer compareTo(Object o) {
            SObjectInfo other = (SObjectInfo)o;
            return this.label.toLowerCase().compareTo(other.label.toLowerCase());
        }
    }
}
