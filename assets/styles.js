import{StyleSheet} from 'react-native';

const s_forms = StyleSheet.create({                  
    container: {
        flexGrow: 1,
        justifyContent:'center',
        alignItems: 'center'
    },
    text_input: {
        marginBottom:10,
        height:45,
        color:'#536c79',
    },
    icon_text:{
        backgroundColor: '#f0f3f5',
        color:'#536c79',
    },
    text_muted:{
        color:'#536c79',
    }
    ,
    text_h1:{
       fontSize:26,
    }
    ,
    text_h2:{
        fontSize:22,
     }
     ,
    box:{
        marginTop:65,
        height:105,
    },
    text_menu: {
        color:'#536c79',
    },
    bgprm: {
        backgroundColor:'#f15a23',
    },
    containerModal: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dialogContentView: {
      flex: 1,
      paddingLeft: 18,
      paddingRight: 18,
       backgroundColor: '#000',
       opacity: 0.4,
       alignItems: 'center',
       justifyContent: 'center',
    },
    navigationBar: {
      borderBottomColor: '#b5b5b5',
      borderBottomWidth: 0.5,
      backgroundColor: '#ffffff',
    },
    navigationTitle: {
      padding: 10,
    },
    navigationButton: {
      padding: 10,
    },
    navigationLeftButton: {
      paddingLeft: 20,
      paddingRight: 40,
    },
    navigator: {
      flex: 1,
      // backgroundColor: '#000000',
    },
    customBackgroundDialog: {
      opacity: 0.5,
      backgroundColor: '#000',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
      dialogContentView: {
        // flex: 1,
        paddingLeft: 18,
        paddingRight: 18,
        // backgroundColor: '#000',
        // opacity: 0.4,
        // alignItems: 'center',
        // justifyContent: 'center',
      },
      navigationBar: {
        borderBottomColor: '#b5b5b5',
        borderBottomWidth: 0.5,
        backgroundColor: '#ffffff',
      },
      navigationTitle: {
        padding: 10,
      },
      navigationButton: {
        padding: 10,
      },
      navigationLeftButton: {
        paddingLeft: 20,
        paddingRight: 40,
      },
      navigator: {
        flex: 1,
        // backgroundColor: '#000000',
      },
      customBackgroundDialog: {
        opacity: 0.5,
        backgroundColor: '#000',
      },
      sRowList1: {
        
        backgroundColor: '#f0f0f0',
      },
      sRowList2: {
        backgroundColor: '#f6f6f6',
      },
      iconitem: {
        marginLeft:10, 
        backgroundColor: '#20B2AA',
        fontSize:30,
        width:'100%',
        color:'#fff',
        textAlign:'center',
        borderRadius:4,
       },
       iconTransitem: {
        marginLeft:5, 
        backgroundColor: '#20B2AA',
        fontSize:28,
        width:'100%',
        color:'#fff',
        textAlign:'center',
        borderRadius:4,
       }
});
 
export default function s_form(){          
    return s_forms;   
}
