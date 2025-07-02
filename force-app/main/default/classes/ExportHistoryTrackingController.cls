public with sharing class ExportHistoryTrackingController {

    private static final Integer SALESFORCE_NO_QUERYMORE_LIMIT = 2000;

    @AuraEnabled(cacheable=true)
    public static List<HistoryTrackingInfo> getHistoryTrackingInfo() {
        // No parameter: fetch for all objects
        return getHistoryTrackingInfoForObjects(null);
    }

    @AuraEnabled(cacheable=true)
    public static List<HistoryTrackingInfo> getHistoryTrackingInfoForObjects(List<String> objectApiNames) {
        System.debug('Fetching history tracking info for objects: ' + objectApiNames);
        try {
            // Check read access for FieldDefinition and EntityDefinition
            if (!Schema.sObjectType.FieldDefinition.isAccessible() || !Schema.sObjectType.EntityDefinition.isAccessible()) {
                throw new AuraHandledException('Insufficient permissions to access field or entity definitions.');
            }
            return fetchHistoryTrackingInfo(objectApiNames);
        } catch (Exception e) {
            throw new AuraHandledException('Failed to fetch history tracking info: ' + e.getMessage());
        }
    }

    // Business logic method
    private static List<HistoryTrackingInfo> fetchHistoryTrackingInfo(List<String> objectApiNames) {
        List<HistoryTrackingInfo> result = new List<HistoryTrackingInfo>();
        if (objectApiNames != null && !objectApiNames.isEmpty()) {
            // Query per object to avoid hitting the 2000 field limit per query
            for (String objApiName : objectApiNames) {
                String soql = 'SELECT EntityDefinition.QualifiedApiName, EntityDefinition.Label, Label, QualifiedApiName, IsFieldHistoryTracked FROM FieldDefinition WHERE EntityDefinition.IsCustomSetting = false AND EntityDefinition.QualifiedApiName = :objApiName LIMIT ' + String.valueOf(SALESFORCE_NO_QUERYMORE_LIMIT);
                List<FieldDefinition> fields = Database.query(soql);
                for (FieldDefinition fd : fields) {
                    HistoryTrackingInfo info = new HistoryTrackingInfo();
                    info.objectLabel = fd.EntityDefinition.Label;
                    info.objectApiName = fd.EntityDefinition.QualifiedApiName;
                    info.fieldLabel = fd.Label;
                    info.fieldApiName = fd.QualifiedApiName;
                    info.historyTracking = fd.IsFieldHistoryTracked;
                    result.add(info);
                }
            }
        } else {
            // No object filter: query all fields (up to 2000)
            String soql = 'SELECT EntityDefinition.QualifiedApiName, EntityDefinition.Label, Label, QualifiedApiName, IsFieldHistoryTracked FROM FieldDefinition WHERE EntityDefinition.IsCustomSetting = false LIMIT ' + String.valueOf(SALESFORCE_NO_QUERYMORE_LIMIT);
            List<FieldDefinition> fields = Database.query(soql);
            for (FieldDefinition fd : fields) {
                HistoryTrackingInfo info = new HistoryTrackingInfo();
                info.objectLabel = fd.EntityDefinition.Label;
                info.objectApiName = fd.EntityDefinition.QualifiedApiName;
                info.fieldLabel = fd.Label;
                info.fieldApiName = fd.QualifiedApiName;
                info.historyTracking = fd.IsFieldHistoryTracked;
                result.add(info);
            }
        }
        return result;
    }

    public class HistoryTrackingInfo {
        @AuraEnabled public String objectLabel;
        @AuraEnabled public String objectApiName;
        @AuraEnabled public String fieldLabel;
        @AuraEnabled public String fieldApiName;
        @AuraEnabled public Boolean historyTracking;
    }
}
