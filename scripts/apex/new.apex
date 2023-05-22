Contact[] cons = [
    SELECT UNCW_Email__c
    FROM Contact
];


for(Contact c : cons){
    c.UNCW_Email__c = c.UNCW_Email__c + '.invalid';
}

update cons;