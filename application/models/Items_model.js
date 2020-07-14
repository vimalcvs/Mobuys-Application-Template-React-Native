

import Db from './allSchemas';

//functions for insertNewUsers
export const insertNewItems = newItems => new Promise((resolve, reject) => {    
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            realm.create(ITEMS_SCHEMA, newItems);
            resolve(newItems);
        });
    }).catch((error) => reject(error));
});

export const queryAllItems = () => new Promise((resolve, reject) => {    
    Realm.open(databaseOptions).then(realm => {        
        let allItems = realm.objects(ITEMS_SCHEMA);
        resolve(allItems);  
    }).catch((error) => {        
        reject(error);  
    });;
});
export const deleteItemList = itemListId => new Promise((resolve, reject) => {    
    Realm.open(databaseOptions).then(realm => {        
        realm.write(() => {
            let deletingItemList = realm.objectForPrimaryKey(ITEMS_SCHEMA, itemListId);
            realm.delete(deletingItemList);
            resolve();   
        });
    }).catch((error) => reject(error));;
});

export const filterItemLists = (searchedText) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let filteredItemLists = realm.objects(ITEMS_SCHEMA)
                                .filtered(`iname CONTAINS[c] "${searchedText}"`);//[c] = case insensitive
        resolve(filteredItemLists);
    }).catch((error) => {
        reject(error);
    });;
});
export const updateItems = ListItems => new Promise((resolve, reject) => {    
    Realm.open(databaseOptions).then(realm => {        
        realm.write(() => {
            let updatingItems = realm.objectForPrimaryKey(ITEMS_SCHEMA, ListItems.iid);   
            updatingItems.iname = ListItems.iname; 
            updatingItems.icode = ListItems.icode; 
            updatingItems.price = ListItems.price;  
            updatingItems.modify_time = ListItems.modify_time;    
            resolve();     
        });
    }).catch((error) => reject(error));;
});