import { StyleSheet, Dimensions } from 'react-native'
import Colors from './Colors'
import CustomeFonts from './CustomeFonts'

const styles = StyleSheet.create({
    cointainer: {
        flex: 1,
        backgroundColor: Colors.white,
        padding: 15,
        // alignSelf : 'center',
        height: '100%'
    },
    dashcointainer1: {
        flex: 1,
        backgroundColor: Colors.divider,
        padding: 6

    },
    cointainer1: {
        flex: 1,
        backgroundColor: Colors.divider,
    },

    dashcard: {
        width: 80,
        padding: 4,
        margin: 5,
        borderRadius: 6,
        borderWidth:2,
        borderColor:'#d3d3d3',
        backgroundColor: Colors.lightwhite, 
    },

    dashtext: {
        color: Colors.black,
        fontFamily: CustomeFonts.medium,
        fontSize: 14,
        alignItems: 'center'

    },
    dashimage: {
        width: 35,
        height: 35
    },

    screenHeading: {
        fontSize: 20, fontFamily: CustomeFonts.regular,
        color: Colors.black,
    },
    Buttonback: {
        backgroundColor: Colors.Theme_color, padding: 10, borderRadius: 8, alignItems: 'center',
    },
    Buttonblank: {
        borderColor: Colors.Theme_color, borderWidth: 2, padding: 10, borderRadius: 8, alignItems: 'center',
    },
    buttonText: {
        color: Colors.white, fontSize: 14, fontFamily: CustomeFonts.regular, alignSelf: 'center'
    },
    Textmainstyle: {
        fontSize: 16, fontFamily: CustomeFonts.medium,
    },
    Textstyle: {
        fontSize: 14, fontFamily: CustomeFonts.regular, width: '100%',
    },
    SubTextstyle: {
        fontSize: 12, fontFamily: CustomeFonts.regular, width: '100%'
    },
    Textbold: {
        fontFamily: CustomeFonts.bold
    },

    line: {
        width: '100%', backgroundColor: Colors.black, height: 1, marginBottom: '5%',
    },
    cardback: {
        flex: 1,
        width: '100%',
        flexDirection: 'column',
        marginBottom: 15,
        padding: 10,
        borderRadius: 2,
        backgroundColor: Colors.white,
        elevation: 2
    },
    absoluteFillObject: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        width: '100%',
        backgroundColor: Colors.Theme_color1
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,


        margin: '5%',
        backgroundColor: Colors.Theme_color1
    },
    errorMessageStyle: {
        fontSize: 12,
        fontFamily: CustomeFonts.regular,
        color: 'red'
    },
    image: {
        height: 120, width: '100%',
    },

    Addbuttonstyle: {

        position: 'absolute',
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        right: 20,
        bottom: 20,
    },
    or: {
        fontFamily: CustomeFonts.regular,
        color: "black",
        marginTop: 40,
        marginBottom: 10
    },
    title: {
        fontSize: 20,
        color: Colors.Theme_color,
        fontFamily: CustomeFonts.medium
    },
    leftTitle: {
        color: Colors.black,
        alignSelf: "stretch",
        textAlign: "left",
    },

    rightTitle: {
        marginTop: 10,
        fontSize: 14,
        color: Colors.Theme_color,
        fontFamily: CustomeFonts.medium,
        alignSelf: "stretch",
        textAlign: "right",
    },
    content: {
        paddingLeft: 50,
        paddingRight: 50,
        textAlign: "center",
        fontSize: 16,
    },
    loginContainer: {
        width: '100%',
        backgroundColor: Colors.Theme_color,
        borderRadius: 8,

        justifyContent: 'center', alignItems: 'center'
    },
    loginText: {
        color: Colors.white,
        fontSize: 14,
        fontFamily: CustomeFonts.medium
    },
    placeholder: {
        fontFamily: CustomeFonts.medium,
        color: "red"
    },
    InputContainer: {
        width: '80%',
        marginTop: 30,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "grey",
        borderRadius: 8
    },
    InputContainerrow: {
        elevation: 8,
        width: '100%',
        marginTop: 20,
        flexDirection: 'row',
        backgroundColor: Colors.white,
        borderRadius: 8
    },
    body: {
        fontSize: 14,
        fontFamily: CustomeFonts.medium,
    },

    //otp
    opt_input_textStyle: {
        textAlign: 'center',
        color: Colors.white,
        fontSize: 14,
        fontFamily: CustomeFonts.regular,
        height: 50,
        width: 50,
    },
    filled_otp: {
        backgroundColor: Colors.Theme_color,
        flex: 1,
        // width: 50,
        height: 60,
        borderWidth: 0.5,
        borderColor: '#fff',
        borderRadius: 10,
        width: '15%',
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    unfilled_otp: {
        backgroundColor: Colors.light_pink,
        flex: 1,
        // width: 50,
        height: 60,
        borderWidth: 0.5,
        borderColor: '#fff',
        borderRadius: 10,
        width: '15%',
        margin: 5
    },

    // our samaj
    header_title: {
        fontFamily: CustomeFonts.regular,
        fontSize: 16,
        color: Colors.black,
        paddingTop: '20%'
    },

    //contact us
    map: {
        ...StyleSheet.absoluteFillObject,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },

    // Persional Details Folder Screen Style
    lightbutton: {
        justifyContent: 'center', alignItems: 'center', width: '23%',
        backgroundColor: Colors.lightThem, borderRadius: 10
    },
    isActivate: {
        width: '50%',
        borderBottomWidth: 2,
        borderColor: Colors.Theme_color,
        justifyContent: 'center',
        alignItems: 'center',

    },
    isDeactive: {
        width: '50%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerTesxt: {
        fontSize: 16,
        color: Colors.Theme_color,
        fontFamily: CustomeFonts.bold
    },
    isActivateTab: {
        width: '33.33%',
        borderBottomWidth: 2,
        borderColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center'
    },
    isDeactiveTab: {
        width: '33.33%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    backView:{
        width:'100%',
        backgroundColor:Colors.white,
        elevation:2,
        padding: '3%',
    },
    flexView:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    }
})

export default styles