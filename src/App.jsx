import Header from "./components/Header/Header";
import SignIn from "./components/Header/SignIn/SignIn";
import SignUp from "./components/Header/SignUp/SignUp";
import Modal from "./components/Modal/Modal";
import { useContext, useState, useEffect} from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { Context } from "./Context";
import LessonTab from "./components/Lesson/LessonTab/LessonTab";
import LessonData from "./components/Lesson/LessonData/LessonData";
import TestPanel from "./components/TestPanel/TestPanel";
import ArrayView from "./components/File/ArrayView/ArrayView";
import MatrixView from "./components/File/MatrixView/MatrixView";
import ImageView from "./components/File/ImageView/ImageView";
import DataGenerator from "./components/File/DataGenerator/DataGenerator";
import CodeEditor from "./components/CodeEditor/CodeEditor";

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
    const [code, setCode] = useState("//");
    if (loading) {
        return <div>Загрузка...</div>
    }

    const handleParamsChange = (params) => {
        console.log('Текущие параметры:', params);
      };
      
    return (
        <>
            <Header username={protectedData && protectedData["username"]} />
            {/* <DataGenerator
                onParamsChange={handleParamsChange}
            /> */}
            <Routes>
                <Route path="/" element={<LessonTab/>}/>
                <Route path="/lesson/:id" element={<LessonData role={protectedData && protectedData["role"]} />} />
                <Route path="/test" element={<TestPanel/>}/>
                <Route path="/test/function/:name" element={<TestPanel/>}/>
                <Route path="*" element={<LessonTab/>}/>
                <Route path="/code" element={<CodeEditor code={code} setCode={setCode} editable={true}/>}/>
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