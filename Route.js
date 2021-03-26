import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { createAppContainer, createSwitchNavigator } from "react-navigation";

import Colors from './src/Theme/Colors'
import CustomeFonts from './src/Theme/CustomeFonts'
import { base_url_1 } from './src/Static'

import Splash from './src/screens/Splash'
import { createStackNavigator } from 'react-navigation-stack';
import Dashboard from './src/screens/Dashboard'
import YojnaList from './src/screens/YojnaList'
import YojnaDetail from './src/screens/YojnaDetail'
import EventLIst from './src/screens/EventLIst'
import EventDetail from './src/screens/EventDetail'
import NewsList from './src/screens/NewsList'
import NewsDetail from './src/screens/NewsDetail'
import CircularDetail from './src/screens/CircularDetails'
import PropertyList from './src/screens/PropertyList'
import PropertyDetail from './src/screens/PropertyDetail'
import PropertyBookingList from './src/screens/PropertyBookingList'
import Matrimony from './src/screens/Matrimony'
import Employment from './src/screens/Employment'
import Jobseeker from './src/screens/Jobseeker'
import JobProvider from './src/screens/JobProvider'
import Gallery from './src/screens/Gallery'
import GallerySwiper from './src/screens/GallerySwiper'
import CircularList from './src/screens/CircularList'
import BusinessInfo from './src/screens/BusinessInfo'
import Suggestion from './src/screens/Suggestion'
import MatrimonyList from './src/screens/MatrimonyList'
import FamilyTree from './src/screens/FamilyTree'
import Donor from './src/screens/Donor'
import Faq from './src/screens/Faq'
import Login from './src/screens/Login'
import Otp from './src/screens/Otp'
import ForgetPassword from './src/screens/ForgetPassword'
import OurSamaj from './src/screens/OurSamaj';
import Aboutus from './src/screens/Aboutus';
import ContactUs from './src/screens/ContactUs';
import Committe from './src/screens/Committe';
import MembersDetails from './src/screens/MembersDetails';
import Addnewpost from './src/screens/Addnewpost';
import PostDetails from './src/screens/PostDetails';
import BecomeDoner from './src/screens/BecomeDoner';
import SampleEventEdit from './src/screens/SampleEventEdit';
import AcadamicEventParticipent from './src/screens/AcadamicEventParticipent';
import PropertyBooking from './src/screens/PropertyBooking';
import MatrimonyDetails from './src/screens/MatrimonyDetails';
import AddFamilyMember from './src/screens/AddFamilyMember';
import Karobaridetails from './src/screens/KarobariDetails'
import KundliImage from './src/screens/KundliImage'
import MemberSearch from './src/screens/MemberSearch'
import EventAppliedList from './src/screens/EventAppliedList'

//Persional Details Folder Screen
import PersionalDetail from './src/screens/PersionalDetails/PersionalDetails'
import ViewOtherPersionalDetails from './src/screens/PersionalDetails/ViewOtherPersionalDetails'
import ViewProfessionalDetails from './src/screens/PersionalDetails/ViewProfessionalDetails'
import ViewMemberDoctorDetails from './src/screens/PersionalDetails/ViewMemberDoctorDetail'
import LookingForJob from './src/screens/PersionalDetails/LookinForJob'
import LookinForMatrimony from './src/screens/PersionalDetails/LookinForMatrimony'
import ViewJobProvider from './src/screens/PersionalDetails/ViewJobProvider'
import AddProduct from './src/screens/PersionalDetails/AddProduct'
import ProductDetails from './src/screens/ProductDetails'
import CompanyProductsList from './src/screens/CompanyProductsList'
import WebView from './src/screens/WebView'
import Videos from './src/screens/Videos'
import FamilyDetails from './src/screens/FamilyDetails';
import AdDetails from './src/screens/AdDetails';
import FamilyTreeMemberDetails from './src/screens/FamilyTreeMemberDetails';
import FamilyTreeRequest from './src/screens/FamilyTreeRequest';
// import realmtest from './src/screens/realmtest';
import VideoView from './src/screens/VideoView';
import FamilyTab from './src/screens/FamilyTab';
import PlayAudio from './src/screens/PlayAudio';
import WhishListView from './src/screens/WhishListView';
import AddWishlist from './src/screens/AddWishlist';
import FirendsView from './src/screens/FirendsView';
import { createMaterialTopTabNavigator, createBottomTabNavigator } from 'react-navigation-tabs';
import Notification from './src/screens/Notification';
import CompanyDetails from './src/screens/CompanyDetails';
import EditProduct from './src/screens/PersionalDetails/EditProduct';
import MatrimonyPackage from './src/screens/MatrimonyPackage';
import BlockUser from './src/screens/BlockUser';
import TermsConditions from './src/screens/TermsConditions';
import JobDetails from './src/screens/Employeement/JobDetails';
import EmployeeDetails from './src/screens/Employeement/EmployeeDetails';
import ProviderJobPostList from './src/screens/Employeement/ProviderJobPostList';
import ProfileComplsary from './src/screens/ProfileComplsary';
import TalentListByMember from './src/screens/Talent/TalentListByMember';
import AddTalent from './src/screens/Talent/AddTalent';
import TalentDetailsPage from './src/screens/Talent/TalentDetailsPage';
import { Icon } from 'react-native-elements';
import NewMenu from './src/screens/NewMenu';
import AppImages from './src/Theme/image';
import AllTaletnt from './src/screens/Talent/AllTaletnt';
import AllPost from './src/screens/AllPost';
import AddProperty from './src/screens/Property/AddProperty';
import ViewAllproperty from './src/screens/Property/ViewAllproperty';
import PropertyDetailsView from './src/screens/Property/PropertyDetailsView';
import ViewMemberProperty from './src/screens/Property/ViewMemberProperty';

const matrimoneyNavi = createMaterialTopTabNavigator({
    MatrimonyList: {
        screen: MatrimonyList,
        navigationOptions: {
            title: 'Matrimony List'
        },
    },
    BlockUser: {
        screen: BlockUser,
        navigationOptions: {
            title: 'Block Users'
        }
    }
}, {
    initialRouteName: 'MatrimonyList',
    swipeEnabled: false,
    tabBarOptions: {
        upperCaseLabel: false,
        style: {
            backgroundColor: Colors.Theme_color,},
        headerTitleStyle: {
            width: '100%',
            fontSize: 16,
            fontFamily: CustomeFonts.regular},
        labelStyle: {
            color: Colors.white,
            fontSize: 16,
            fontFamily: CustomeFonts.medium,
        },
        indicatorStyle: {
            backgroundColor: Colors.white,
            borderRadius: 10,
        },
    }
})

const topTabNavi = createMaterialTopTabNavigator({
    Photos: {
        screen: Gallery,
        navigationOptions: {
            title: 'Photos',
            headerTitleStyle: {
                width: '100%',
                fontWeight: '200',
                fontFamily: CustomeFonts.regular
            }
        }
    },
    Videos: {
        screen: Videos,
        navigationOptions: {
            title: 'Videos',
            headerTitleStyle: {
                width: '100%',
                fontWeight: '200',
                fontFamily: CustomeFonts.regular
            }
        }
    }
}, {
    initialRouteName: 'Photos',
    tabBarOptions: {
        upperCaseLabel: false,
        style: {
            backgroundColor: Colors.Theme_color,
        },
        labelStyle: {
            color: Colors.white,
            fontSize: 16,
            fontWeight: '500',
            fontFamily: CustomeFonts.medium,
        },
        indicatorStyle: {
            backgroundColor: Colors.white,
            borderRadius: 10,
        },
    },
})

const topTabNaviTree = createMaterialTopTabNavigator({
    FamilyTreeView: {
        screen: FamilyTree,
        navigationOptions: {
            title: 'Family Tree',
        },
    },
    // FamilyTreeRequest: {
    //     screen: FamilyTreeRequest,
    //     navigationOptions: {
    //         title: 'Family Photos',
    //     }
    // },
}, {
    initialRouteName: 'FamilyTreeView',
    tabBarOptions: {
        upperCaseLabel: false,
        style: {
            backgroundColor: Colors.Theme_color,
        },
        headerTitleStyle: {
            width: '100%',
            fontWeight: '200',
            fontFamily: CustomeFonts.regular
        },
        labelStyle: {
            color: Colors.white,
            fontSize: 16,
            fontWeight: '500',
            fontFamily: CustomeFonts.medium,
        },
        indicatorStyle: {
            backgroundColor: Colors.white,
            borderRadius: 10,
        },
    },
})

const bottomHomeTab = createBottomTabNavigator({
    Dashboard: {
        screen: Dashboard,
        navigationOptions: {
            header: null,
            tabBarLabel:'Home',  
            tabBarIcon: ({ tintColor }) => (
                <Icon name="home" type='font-awesome-5' color={tintColor} size={25} />
            )
        }
    },
    MembersDetails: {
        screen: MembersDetails,
        navigationOptions: {
            tabBarLabel:'Profile',  
            tabBarIcon: ({ tintColor }) => (
                <Icon name="user-alt" type='font-awesome-5' color={tintColor} size={25} />
            )
        }
    },
    OurSamaj: {
        screen: OurSamaj,
        navigationOptions: {
            tabBarLabel:'We',  
            tabBarIcon: ({ tintColor }) => (
                <Image
                source={AppImages.logo}
                style={{ height: 55, width: 55, borderRadius: 55 / 2, marginBottom:25 }}
                borderRadius={100}
                resizeMode='contain'
                resizeMethod='resize'
              />
            )
        }
    },
    NewsList: {
        screen: NewsList,
        navigationOptions: {
            tabBarLabel:'News',  
            tabBarIcon: ({ tintColor }) => (
                <Icon name="newspaper" type='ionicon' color={tintColor} size={25} />
            )
        }
    },
    NewMenu: {
        screen: NewMenu,
        navigationOptions: {
            tabBarLabel:'More',  
            tabBarIcon: ({ tintColor }) => (
                <Icon name="grid" type='ionicon' color={tintColor} size={25} />
            )
        }
    },
  
},
    {
        initialRouteName: 'Dashboard',
        swipeEnabled: false,
        tabBarOptions: {
            upperCaseLabel: false,
            style: {
                height:55,
               
            },
            headerTitleStyle: {
                width: '100%',
                fontSize: 14,
                fontFamily: CustomeFonts.regular
            },
            labelStyle: {
                // color: Colors.white,
                fontSize: 14,
                fontFamily: CustomeFonts.medium,
               
            },
            activeTintColor: Colors.Theme_color,
            inactiveTintColor: Colors.black
        }
    })
const Stack_Navi = createStackNavigator(
    {
        splash: {screen: Splash,navigationOptions: {    header: null}},
        Login: {screen: Login,navigationOptions: {    header: null}},
        Otp: {screen: Otp,navigationOptions: {    header: null}},
        ForgetPassword: {screen: ForgetPassword,navigationOptions: {    header: null}},
        Dashboard: {screen: bottomHomeTab,navigationOptions: {    header: null}},
        YojnaList: {screen: YojnaList,},
        YojnaDetail: {screen: YojnaDetail,path: 'yojna-detail/:yojnaId'},
        EventLIst: {screen: EventLIst,},
        EventDetail: {screen: EventDetail,},
        NewsList: {screen: NewsList,},
        NewsDetail: {screen: NewsDetail,path: 'news-detail/:newsId'},
        CircularDetail: {screen: CircularDetail,path: 'circular-detail/:circularId'},
        PropertyList: {screen: PropertyList,},
        PropertyDetail: {screen: PropertyDetail,},
        PropertyBookingList: {screen: PropertyBookingList,},
        Matrimony: {screen: Matrimony,navigationOptions: {    header: null}},
        Employment: {screen: Employment,},
        Jobseeker: {screen: Jobseeker,},
        JobProvider: {screen: JobProvider,},
        Gallery: {screen: topTabNavi,navigationOptions: {    header: null}},
        GallerySwiper: {screen: GallerySwiper,},
        CircularList: {screen: CircularList,},
        BusinessInfo: {screen: BusinessInfo,},
        Suggestion: {screen: Suggestion,},
        MatrimonyList: {screen: matrimoneyNavi,navigationOptions: {    header: null}},
        FamilyTree: {screen: topTabNaviTree,navigationOptions: {    header: null}},
        FamilyTab: {screen: FamilyTab,},
        FamilyTreeRequest: {screen: FamilyTreeRequest,},
        FamilyDetails: {screen: FamilyDetails,},
        AdDetails: {screen: AdDetails,},
        Donor: {screen: Donor,},
        Faq: {screen: Faq,},
        OurSamaj: {screen: OurSamaj,},
        Aboutus: {screen: Aboutus,},
        ContactUs: {screen: ContactUs,},
        Committe: {screen: Committe,},
        MembersDetails: {screen: MembersDetails,},
        ProductDetails: {screen: ProductDetails,},
        CompanyProductsList: {screen: CompanyProductsList,},
        Addnewpost: {screen: Addnewpost,},
        PostDetails: {screen: PostDetails,path: 'post-detail/:postId'},
        CompanyDetails: {screen: CompanyDetails,},
        EditProduct: {screen: EditProduct,},
        BecomeDoner: {screen: BecomeDoner,},
        SampleEventEdit: {screen: SampleEventEdit,},
        AcadamicEventParticipent: {screen: AcadamicEventParticipent,},
        PropertyBooking: {screen: PropertyBooking,},
        MatrimonyDetails: {screen: MatrimonyDetails,},
        AddFamilyMember: {screen: AddFamilyMember,},
        // Persional Details Folder Screen Navigation
        PersionalDetail: {screen: PersionalDetail},
        ViewOtherPersionalDetails: {screen: ViewOtherPersionalDetails},
        ViewProfessionalDetails: {screen: ViewProfessionalDetails,navigationOptions: {    header: null}},
        ViewMemberDoctorDetails: {screen: ViewMemberDoctorDetails},
        AddProduct: {screen: AddProduct},
        LookingForJob: {screen: LookingForJob},
        LookinForMatrimony: {screen: LookinForMatrimony,navigationOptions: {    header: null}},
        ViewJobProvider: {screen: ViewJobProvider},
        Karobaridetails: {screen: Karobaridetails},
        KundliImage: {screen: KundliImage},
        MemberSearch: {screen: MemberSearch},
        EventAppliedList: {screen: EventAppliedList},
        FamilyTreeMemberDetails: {screen: FamilyTreeMemberDetails},
        WebView: {screen: WebView},
        // realmtest: {
        //     screen: realmtest
        // },
        VideoView: {screen: VideoView},
        PlayAudio: {screen: PlayAudio},
        WhishListView: {screen: WhishListView},
        AddWishlist: {screen: AddWishlist},
        FirendsView: {screen: FirendsView},
        Notification: {screen: Notification},
        MatrimonyPackage: {screen: MatrimonyPackage,navigationOptions: {    header: null}},
        TermsConditions: {screen: TermsConditions,},
        JobDetails: {screen: JobDetails,},
        EmployeeDetails: {screen: EmployeeDetails,},
        ProviderJobPostList: {screen: ProviderJobPostList,},
        ProfileComplsary: {screen: ProfileComplsary,},
        TalentListByMember: {screen: TalentListByMember,},
        AddTalent: {screen: AddTalent,},
        TalentDetailsPage: {screen: TalentDetailsPage,path: 'talent-detail/:talentId'},
        AllTaletnt:{screen:AllTaletnt},
        AllPost:{screen:AllPost},
        NewMenu:{screen:NewMenu},
        AddProperty:{screen:AddProperty},
        ViewAllproperty:{screen:ViewAllproperty},
        PropertyDetailsView:{screen:PropertyDetailsView},
        ViewMemberProperty:{screen:ViewMemberProperty},
    
    },
    {
        initialRouteName:'splash'
    }
)

const prefix = Platform.OS == 'android' ? base_url_1 : base_url_1;

// const AppContainer = createAppContainer(Stack_Navi)

// export default () => {
//     const prefix = 'myapp://'
//     return <AppContainer uriPrefix={prefix} />
// }

const App = createAppContainer(Stack_Navi)
const MainApp = () => <App uriPrefix={prefix} />;
export default MainApp
    //export default createAppContainer(Stack_Navi)
