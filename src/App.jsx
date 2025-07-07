import Header from "./components/Header/Header";
import SignIn from "./components/Header/SignIn/SignIn";
import SignUp from "./components/Header/SignUp/SignUp";
import Modal from "./components/Modal/Modal";
import { useContext, useState, useEffect} from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { Context } from "./Context";
import Preview from "./components/Preview/Preview";
import LessonTabPublic from "./components/Lesson/LessonTab/LessonTabPublic";
import LessonTabControl from "./components/Lesson/LessonTab/LessonTabControl";
import LessonData from "./components/Lesson/LessonData/LessonData";
import CodeEditor from "./components/CodeEditor/CodeEditor";
import TestList from "./components/TestResult/TestList";
import FileField from './components/FileField/FileField';
import UserField from './components/UserField/UserField';
import UserControl from './components/UserField/UserControl';
import SubscribeLinkHandler from './components/LinkHandler/SubscribeLinkHandler';
import CodeLinkHandler from './components/LinkHandler/CodeLinkHandler';
import RegisterLinkHandler from './components/LinkHandler/RegisterLinkHandler';
import UserPage from './components/UserPage/UserPage';

const App = () => {
    const { protectedData, loading } = useContext(Context);
    const [isModalSignInOpen, setIsModalSignInOpen] = useState(false);
    const [isModalSignUpOpen, setIsModalSignUpOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === "/login") {
            setIsModalSignInOpen(true);
            setIsModalSignUpOpen(false);
        } else if (location.pathname === "/register") {
            setIsModalSignInOpen(false);
            setIsModalSignUpOpen(true);
        } else {
            setIsModalSignInOpen(false);
            setIsModalSignUpOpen(false);
        }
    }, [location.pathname]);

    const closeModalSignIn = () => {
        setIsModalSignInOpen(false);
        navigate('/');
    };

    const closeModalSignUp = () => {
        setIsModalSignUpOpen(false);
        navigate('/');
    };
    const [code, setCode] = useState("");
    if (loading) {
        return <div>Загрузка...</div>
    }
      
    return (
        <>
            <Header userdata={protectedData} />
            <Routes>
                <Route path="*" element={<Preview/>}/>
                <Route path="/lessons" element={(protectedData && protectedData.role === 'admin') ? <LessonTabControl /> : <LessonTabPublic/> }/>
                <Route path="/lesson/:id/:title" element={<LessonData />} />
                <Route path="/subscribe/:token" element={<SubscribeLinkHandler />} />
                <Route path="/register/:token" element={<RegisterLinkHandler />} />
                {protectedData?.role === 'admin' &&
                <>
                    <Route path="/" element={<UserControl/>}/>
                </>
                }
                {protectedData && protectedData.role !== 'admin' &&
                <>
                    <Route path="/" element={<UserPage />}/>
                    <Route path="/data" element={<FileField/>} />
                    <Route path="/code" element={<CodeEditor code={code} setCode={setCode} editable={true}/>}/>
                    <Route path="/code/:type/:taskId" element={<CodeLinkHandler/>} />
                    <Route path="/results" element={<TestList />}/>
                    <Route path="/students" element={<UserField />}/>
                </>
                }
            </Routes>
            <Modal style={{width: '25vw'}} open={isModalSignInOpen} onCloseClick={closeModalSignIn}>
                <SignIn/>
            </Modal>
            <Modal style={{width: '25vw'}} open={isModalSignUpOpen} onCloseClick={closeModalSignUp}>
                <SignUp/>
            </Modal>
        </>
    )
};

export default App;