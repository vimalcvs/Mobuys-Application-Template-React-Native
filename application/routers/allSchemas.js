/*
*********
Created November 2018 By AK78 - yayasunarya@gmail.com
*********
===========================================
Big Thank to :
Mr Nguyen Duc Hoang
https://www.youtube.com/c/nguyenduchoang
Email: sunlight4d@gmail.com
TodoListComponent = "TodoList Screen"
==========================================

*/

import Realm from 'realm';
import moment from 'moment';

export const ITEMS_SCHEMA           = "items";
export const GTRANS_SCHEMA          = "gtrans";
export const GTRANS_DETAIL_SCHEMA   = "gtrans_detail";
export const GTRANS_PAYMENT_SCHEMA  = "gtrans_payment";
export const CONFIGS_SCHEMA         = "configs";
export const MOBAPP_SCHEMA          = "mobapp";
export const PERSON_SCHEMA          = "person";
export const DU_SCHEMA              = "history_delete_update";


// Define your models and their properties
export const ItemsSchema = {
    name: ITEMS_SCHEMA,
    primaryKey: 'icode',
    properties: {
        iid         : { type: 'int' },    // primary key
        icode       : { type: 'string'},
        iname       : { type: 'string'},
        price       : { type: 'float',default: 0},
        harga_beli  : { type: 'float',default: 0},
        create_time : { type: 'date'},
        modify_time : { type: 'date'},
        nomorlist   : { type: 'int',default:0 },
    }
};
//hna         : { type: 'float',default: 0},
export const GtransSchema = {
    name: GTRANS_SCHEMA,
    primaryKey: 'gtid',
    properties: {
        gtid         : { type: 'int'},    // primary key
        trans_date   : { type: 'date'},
        amount       : { type: 'float',default: 0},
        tanggal      : { type: 'int'}, 
        bulan        : { type: 'int'}, 
        tahun        : { type: 'int'}, 
        cust_name    : { type: 'string'},
        cust_address : { type: 'string'},
        create_time  : { type: 'date'},
        modify_time  : { type: 'date'},
        create_id    : { type: 'int'}, 
        modify_id    : { type: 'int'},
        is_payed       :{  type: 'bool', default: false},
        amount_payment : { type: 'float',default: 0},
        amount_diskon  : { type: 'float',default: 0},
        amount_cash    : { type: 'float',default: 0},
        amount_charge  : { type: 'float',default: 0},    
        notes          : { type: 'string',default:''},
        pay_date       : { type: 'date',default: new Date()},
        user_pay       : { type: 'string'},
        user_bill      : { type: 'string'},
    }
};

export const GtransDetailSchema = {
    name: GTRANS_DETAIL_SCHEMA,
    primaryKey: 'gtdid',
    properties: {
        gtdid        : { type: 'int' },    // primary key
        gtid         : { type: 'int'}, 
        trans_date   : { type: 'date',default: new Date()},
        icode        : { type: 'string'},
        iname        : { type: 'string'},
        vol          : { type: 'float',default: 0},    
        amount_subtotal : { type: 'float',default: 0},
        amount_price : { type: 'float',default: 0},
        amount_diskon: { type: 'float',default: 0},
        create_time  : { type: 'date',default: new Date()},
        modify_time  : { type: 'date',default: new Date()},
    }
};

export const GtransPaymentSchema = {
    name: GTRANS_PAYMENT_SCHEMA,
    primaryKey: 'gtpid',
    properties: {
        gtpid          : { type: 'int'},    // primary key
        gtid           : { type: 'int'},
        pay_type       : { type: 'int',default :1},  // 1 CASH 
        amount_total   : { type: 'float',default: 0},
        amount_payment : { type: 'float',default: 0},
        amount_diskon  : { type: 'float',default: 0},
        amount_cash    : { type: 'float',default: 0},
        amount_charge  : { type: 'float',default: 0},    
        notes          : { type: 'string'},
        pay_date       : { type: 'date',default: new Date()},
        create_time    : { type: 'date',default: new Date()},
        modify_time    : { type: 'date',default: new Date()},
    }
};
export const ConfigsSchema = {
    name: CONFIGS_SCHEMA,
    primaryKey: 'cid',
    properties: {
        cid     : { type: 'int', indexed: true },    // primary key
        cname   : { type: 'string'},
        cdata   : { type: 'string'},
        cgroup  : { type: 'string',default:''},
        create_date: { type: 'date',default: new Date()},
    }
};
export const PersonSchema = {
    name: PERSON_SCHEMA,
    primaryKey: 'pid',
    properties: {
        pid             : { type: 'int', indexed: true },    // primary key
        pname           : { type: 'string', indexed: true },
        pcontact        : { type: 'string',default:'' },
        paddress        : { type: 'string',default:'' },
        pemail          : { type: 'string',default:'' },
        puser_name      : { type: 'string' },
        plogin_pass     : { type: 'string' },
        pmobile_ime     : { type: 'string',default:'' },
        preg_date       :{ type: 'date',default: new Date()},
        papproval_date  : { type: 'date',default: new Date()},
        papproval_code  : { type: 'string',default:'' },
        create_date     : { type: 'date',default: new Date()},
    }
};

export const MobappSchema = {
    name: MOBAPP_SCHEMA,
    primaryKey: 'maid',
    properties: {
        maid         : { type: 'int' },    // primary key
        masecretid   : { type: 'string'},
        masecretkey  : { type: 'string'},
        notes        : { type: 'string',default: ''},
        create_time  : { type: 'date',default: new Date()},
        modify_time  : { type: 'date',default: new Date()},
    }
};
//hna         : { type: 'float',default: 0},
export const DuSchema = {
    name: DU_SCHEMA,
    primaryKey: 'duid',
    properties: {
        duid         : { type: 'int'},    // primary key
        gtid         : { type: 'int'},    
        trans_date   : { type: 'date',default: new Date()},
        amount       : { type: 'float',default: 0},
        cust_name    : { type: 'string',default: '-'},
        cust_address : { type: 'string',default: '-'},
        create_time  : { type: 'date',default: new Date()},
        modify_time  : { type: 'date',default: new Date()},
        create_id    : { type: 'int',default: 0}, 
        modify_id    : { type: 'int',default: 0},
        is_payed       :{  type: 'bool', default: false},
        amount_payment : { type: 'float',default: 0},
        amount_diskon  : { type: 'float',default: 0},
        amount_cash    : { type: 'float',default: 0},
        amount_charge  : { type: 'float',default: 0},    
        notes          : { type: 'string',default:''},
        pay_date       : { type: 'date',default: new Date()},
        user_pay       : { type: 'string',default: '-'},
        user_bill      : { type: 'string',default: '-'},
        user_del       : { type: 'string',default: '-'}, 
        notes_del      : { type: 'string',default: '-'},
        date_del       : { type: 'date',default: new Date()},

    }
};


const databaseOptions = {
    path: 'MObuysDB.realm',
    schema: [ItemsSchema,GtransSchema,GtransDetailSchema,ConfigsSchema,MobappSchema,PersonSchema,DuSchema],
    schemaVersion: 0, //optional    
};


//functions for insertNewItems
export const insertMigrasiItems = push_data => new Promise((resolve, reject) => {    
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            push_data.forEach(function(array2) {
                    //window.console.log(array2);
                   // if(array2['icode']!=='undefined') 
                    realm.create(ITEMS_SCHEMA, array2);
                });
                resolve();    
        });
    }).catch((error) => reject(error));
});
export const insertNewItems = newItems => new Promise((resolve, reject) => {    
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            realm.create(ITEMS_SCHEMA, newItems);
            resolve(newItems);
        });
    }).catch((error) => reject(error));
});

export const ItemsQTY = (searchedText) => new Promise((resolve, reject) => {    
    Realm.open(databaseOptions).then(realm => {
        let allItems = realm.objects(ITEMS_SCHEMA).filtered(`iname CONTAINS[c] "${searchedText}"`).sorted(byKeyPath="iname")
        resolve(allItems.length);  
    }).catch((error) => {        
        reject(error);  
    });;
});

export const queryAllItems = (searchedText,s_paging,e_paging) => new Promise((resolve, reject) => {    
    Realm.open(databaseOptions).then(realm => {
        let allItems = realm.objects(ITEMS_SCHEMA).filtered(`iname CONTAINS[c] "${searchedText}"`).sorted(byKeyPath="iname").slice(s_paging,e_paging)
        resolve(allItems);  
    }).catch((error) => {        
        reject(error);  
    });;
});

export const queryBlockItems = () => new Promise((resolve, reject) => {    
    Realm.open(databaseOptions).then(realm => {
        let allItems = realm.objects(ITEMS_SCHEMA).filtered(`nomorlist > 0 `).sorted(byKeyPath="nomorlist").slice(0,20);
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
export const deleteAllItems = () => new Promise((resolve, reject) => {    
    Realm.open(databaseOptions).then(realm => {        
        realm.write(() => {
            let allitems = realm.objects(ITEMS_SCHEMA);
            realm.delete(allitems);
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
            let updatingItems = realm.objectForPrimaryKey(ITEMS_SCHEMA, ListItems.icode);   
            updatingItems.iname = ListItems.iname; 
            updatingItems.price = ListItems.price;  
            updatingItems.harga_beli = ListItems.harga_beli;  
            updatingItems.nomorlist = ListItems.nomorlist;  
            updatingItems.modify_time = Date();    
            resolve();     
        });
    }).catch((error) => reject(error));;
});

/*======== BEGIN TRANS =========*/

export const GetMaxgtid = ()  => new Promise((resolve, reject) => {  
    Realm.open(databaseOptions).then(realm => {        
         let newGtid = realm.objects(GTRANS_SCHEMA).sorted(byKeyPath="gtid",true).slice(0,1)
         resolve(newGtid);  
     }).catch((error) => {        
         reject(error);  
     });
});
export const insertNewTrans = (newTrans) => new Promise((resolve, reject) => {  
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            realm.create(GTRANS_SCHEMA, newTrans);
            resolve();
        });
        
   }).catch((error) => reject(error));
});
export const queryAllTrans = (tgl1,tgl2,s_paging,e_paging,searchedText) => new Promise((resolve, reject) => {
    tgl1=moment(tgl1).format("YYYY-MM-DDT00:00:00");
    tgl2=moment(tgl2).format("YYYY-MM-DDT23:59:59");
    Realm.open(databaseOptions).then(realm => {        
       var addsql= "";
       if (searchedText!="") addsql=" AND gtid="+searchedText; 
       let allTrans = realm.objects(GTRANS_SCHEMA).filtered('( trans_date >=$0 AND trans_date <=$1 ) '+addsql,tgl1,tgl2).sorted(byKeyPath="gtid",true).slice(s_paging,e_paging);
       resolve(allTrans);  
    }).catch((error) => {        
        reject(error);  
    });
});
export const queryExportTrans = (tgl1,tgl2) => new Promise((resolve, reject) => {
    tgl1=moment(tgl1).format("YYYY-MM-DDT00:00:00");
    tgl2=moment(tgl2).format("YYYY-MM-DDT23:59:59");
    Realm.open(databaseOptions).then(realm => {        
       let allTransEx = realm.objects(GTRANS_SCHEMA).filtered('( trans_date >=$0 AND trans_date <=$1 ) ',tgl1,tgl2).sorted(byKeyPath="trans_date",true);
       resolve(allTransEx);  
    }).catch((error) => {        
        reject(error);  
    });
});
export const queryExportTransDetail = (tgl1,tgl2) => new Promise((resolve, reject) => {
    tgl1=moment(tgl1).format("YYYY-MM-DDT00:00:00");
    tgl2=moment(tgl2).format("YYYY-MM-DDT23:59:59");
    Realm.open(databaseOptions).then(realm => {        
       let allTransEx = realm.objects(GTRANS_DETAIL_SCHEMA).filtered('( trans_date >=$0 AND trans_date <=$1 ) ',tgl1,tgl2).sorted(byKeyPath="trans_date",true);
       resolve(allTransEx);  
    }).catch((error) => {        
        reject(error);  
    });

});
export const insertNewTrans_detail = push_data => new Promise((resolve, reject) => {    
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            push_data.forEach(function(element) {
                //window.console.log(array2);
                realm.create(GTRANS_DETAIL_SCHEMA, element);
            });
            resolve();    
        });
    }).catch((error) => reject(error));
});
export const insertNewPayment = newPayment => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {        
        realm.write(() => {
           // window.console.log(newPayment);
            let updatingPayment = realm.objectForPrimaryKey(GTRANS_SCHEMA,newPayment.gtid);   
            updatingPayment.is_payed        = true; 
            updatingPayment.amount_payment  = parseFloat(newPayment.amount_payment); 
            updatingPayment.amount_diskon   = parseFloat(newPayment.amount_diskon);  
            updatingPayment.amount_cash     = parseFloat(newPayment.amount_cash); 
            updatingPayment.amount_charge   = parseFloat(newPayment.amount_charge); 
            updatingPayment.notes           = newPayment.notes;  
            updatingPayment.pay_date        = Date();
            updatingPayment.user_pay        = newPayment.user_pay;     
            resolve();     
        });
    }).catch((error) => reject(error));
    
});
export const deleteTrans = TransId => new Promise((resolve, reject) => {    
    Realm.open(databaseOptions).then(realm => {        
        realm.write(() => {
            let deletingTrans= realm.objectForPrimaryKey(GTRANS_SCHEMA, TransId);
            realm.delete(deletingTrans);
            resolve();   
        });
    }).catch((error) => reject(error));;
});
export const DetailTransaksi = (searchedText) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {    
        let result = realm.objects(GTRANS_DETAIL_SCHEMA).filtered('gtid ='+searchedText);
       // window.console.log(result);
        resolve(result);  
    }).catch((error) => {        
        reject(error);  
    });
});
export const IsPayment = (searchedText) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {    
        let result = realm.objects(GTRANS_PAYMENT_SCHEMA).filtered('gtid = '+searchedText);
        let val = result[0].cdata;
        resolve(val);  
    }).catch((error) => {        
        reject(error);  
    });
});
export const rekap_penjualan = (tgl1,tgl2) => new Promise((resolve, reject) => {
    tgl1=moment(tgl1).format("YYYY-MM-DDT00:00:00");
    tgl2=moment(tgl2).format("YYYY-MM-DDT23:59:59");
    Realm.open(databaseOptions).then(realm => {        
       let allTransEx = realm.objects(GTRANS_SCHEMA).filtered('( trans_date >=$0 AND trans_date <=$1 AND is_payed=true ) ',tgl1,tgl2).sorted(byKeyPath="trans_date",false);
      
       resolve(allTransEx);  
    }).catch((error) => {        
        reject(error);  
    });
});
export const DeletePayment = newPayment => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {        
        realm.write(() => {
           // window.console.log(newPayment);
            let updatingPayment = realm.objectForPrimaryKey(GTRANS_SCHEMA,newPayment.gtid);   
            updatingPayment.is_payed        = false; 
            updatingPayment.amount_payment  = 0; 
            updatingPayment.amount_diskon   = 0;  
            updatingPayment.amount_cash     = 0; 
            updatingPayment.amount_charge   = 0; 
            updatingPayment.notes           = '-';
            updatingPayment.user_pay        = '-';  
           // updatingPayment.pay_date      = Date();   
            resolve();     
        });
    }).catch((error) => reject(error));
    
});
export const insertHisDel = newItems => new Promise((resolve, reject) => {    
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            realm.create(DU_SCHEMA, newItems);
            resolve(newItems);
        });
    }).catch((error) => reject(error));
});

export const queryHistory = (tgl1,tgl2,s_paging,e_paging,searchedText) => new Promise((resolve, reject) => {
    tgl1=moment(tgl1).format("YYYY-MM-DDT00:00:00");
    tgl2=moment(tgl2).format("YYYY-MM-DDT23:59:59");
    Realm.open(databaseOptions).then(realm => {        
       var addsql= "";
       if (searchedText!="") addsql=" AND gtid="+searchedText; 
     //  let allTrans = realm.objects(DU_SCHEMA);
     let allTrans = realm.objects(DU_SCHEMA).filtered('( date_del >=$0 AND date_del <=$1 ) '+addsql,tgl1,tgl2).sorted(byKeyPath="gtid",true).slice(s_paging,e_paging);
      // window.console.log(allTrans);
       resolve(allTrans);  
    }).catch((error) => {        
        reject(error);  
    });
});

/*=========== END TRANS ==========*/

/*======== BEGIN CONFIGS =========*/
export const insertNewConfigs = push_data => new Promise((resolve, reject) => {    
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            push_data.forEach(function(dataconf) {
               realm.create(CONFIGS_SCHEMA, dataconf);
            });
            resolve();    
        });
    }).catch((error) => reject(error));
});
export const queryConfigs = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {        
        let theConf = realm.objects(CONFIGS_SCHEMA);
        resolve(theConf);  
    }).catch((error) => {        
        reject(error);  
    });
});
export const deleteAllConfigs = () => new Promise((resolve, reject) => {    
    Realm.open(databaseOptions).then(realm => {        
        realm.write(() => {
            let allconfigs = realm.objects(CONFIGS_SCHEMA);
            realm.delete(allconfigs);
            resolve();
        });
    }).catch((error) => reject(error));;
});
export const GetConfigName = (searchedText) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {    
        let result = realm.objects(CONFIGS_SCHEMA);
        let tanDogs = result.filtered('cname = "'+searchedText+'"');
        let val = tanDogs[0].cdata;
        resolve(val);  
    }).catch((error) => {        
        reject(error);  
    });
});
/*======== END CONFIGS =========*/
/* */
export const GetDataRegsLenght = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {        
        let theConf = realm.objects(MOBAPP_SCHEMA);
        let ada=theConf.length;
        resolve(ada);  
    }).catch((error) => {        
        reject(error);  
    });
});

export const GetDataRegs = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {        
        let theConf = realm.objects(MOBAPP_SCHEMA);
        resolve(theConf);  
    }).catch((error) => {        
        reject(error);  
    });
});

export const insertNewMobApp = push_data => new Promise((resolve, reject) => {    
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            realm.create(MOBAPP_SCHEMA, push_data);
            resolve();    
        });
    }).catch((error) => reject(error));
});
export const deleteAllMobApp = () => new Promise((resolve, reject) => {    
    Realm.open(databaseOptions).then(realm => {        
        realm.write(() => {
            let allconfigs = realm.objects(MOBAPP_SCHEMA);
            realm.delete(allconfigs);
            resolve();
        });
    }).catch((error) => reject(error));;
});

/* */

export const GetPersonLenght = (username,userpass) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {        
        let theConf = realm.objects(PERSON_SCHEMA).filtered('puser_name="'+username+'" AND plogin_pass="'+userpass+'"');
       // window.console.log(theConf);
        let ada=theConf.length;
        resolve(ada);  
    }).catch((error) => {        
        reject(error);  
    });
});

export const GetPersonRegs = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {        
        let theConf = realm.objects(PERSON_SCHEMA);
        resolve(theConf);  
    }).catch((error) => {        
        reject(error);  
    });
});
export const GetPersonByPid = (pid) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {        
        let theConf = realm.objects(PERSON_SCHEMA).filtered('pid='+pid);
        resolve(theConf);  
    }).catch((error) => {        
        reject(error);  
    });
});

export const GetPersonByLogin = (username,userpass) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {        
        let theConf = realm.objects(PERSON_SCHEMA).filtered('puser_name="'+username+'" AND plogin_pass="'+userpass+'"');
        resolve(theConf);  
    }).catch((error) => {        
        reject(error);  
    });
});

export const insertNewPerson = push_data => new Promise((resolve, reject) => {    
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            realm.create(PERSON_SCHEMA, push_data);
            resolve();    
        });
    }).catch((error) => reject(error));
});
export const deletePerson = () => new Promise((resolve, reject) => {    
    Realm.open(databaseOptions).then(realm => {        
        realm.write(() => {
            let allconfigs = realm.objects(PERSON_SCHEMA);
            realm.delete(allconfigs);
            resolve();
        });
    }).catch((error) => reject(error));;
});
export const deletePersonByPid = (pid) => new Promise((resolve, reject) => {    
    Realm.open(databaseOptions).then(realm => {        
        realm.write(() => {
            let deletingperson = realm.objectForPrimaryKey(PERSON_SCHEMA, pid);
            realm.delete(deletingperson);
            resolve();   
        });
    }).catch((error) => reject(error));;
});

export default new Realm(databaseOptions);
/*
export const queryAllItems = () => new Promise((resolve, reject) => {    
    Realm.open(databaseOptions).then(realm => {        
        let allItems = realm.objects(ITEMS_SCHEMA);
        resolve(allItems);  
    }).catch((error) => {        
        reject(error);  
    });;
});
Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            realm.create(GTRANS_PAYMENT_SCHEMA, newPayment);
            resolve(newPayment);
        });
    }).catch((error) => reject(error));
export const updateItems = ListItems => new Promise((resolve, reject) => {    
    Realm.open(databaseOptions).then(realm => {        
        realm.write(() => {
            let updatingItems = realm.objectForPrimaryKey(ITEMS_SCHEMA, ListItems.id);   
            updatingItems.name = ListItems.name;    
            resolve();     
        });
    }).catch((error) => reject(error));;
});

export const deleteTodoList = todoListId => new Promise((resolve, reject) => {    
    Realm.open(databaseOptions).then(realm => {        
        realm.write(() => {
            let deletingTodoList = realm.objectForPrimaryKey(TODOLIST_SCHEMA, todoListId);
            realm.delete(deletingTodoList);
            resolve();   
        });
    }).catch((error) => reject(error));;
});
export const deleteAllTodoLists = () => new Promise((resolve, reject) => {    
    Realm.open(databaseOptions).then(realm => {        
        realm.write(() => {
            let allTodoLists = realm.objects(TODOLIST_SCHEMA);
            realm.delete(allTodoLists);
            resolve();
        });
    }).catch((error) => reject(error));;
});*/

/*



// Define your models and their properties
export const UsersSchema = {
    name: USERS_SCHEMA,
    primaryKey: 'user_id',
    properties: {
        user_id: 'int',    // primary key
        user_name: { type: 'string', indexed: true },
       // user_contact: { type: 'string' },
       // user_address: { type: 'string' },
    }
};



export const insertNewUsers = newUsers => new Promise((resolve, reject) => {    
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            realm.create(USERS_SCHEMA, newUsers);
            resolve(newUsers);
        });
    }).catch((error) => reject(error));
});
*/
