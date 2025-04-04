import Header from "./components/Header/Header";
import SignIn from "./components/Header/SignIn/SignIn";
import SignUp from "./components/Header/SignUp/SignUp";
import Modal from "./components/Modal/Modal";
import { useContext, useState, useEffect} from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { Context } from "./Context";
import Preview from "./components/Preview/Preview";
import LessonTab from "./components/Lesson/LessonTab/LessonTab";
import LessonTabPublic from "./components/Lesson/LessonTab/LessonTabPublic";
import LessonData from "./components/Lesson/LessonData/LessonData";
import TestPanel from "./components/TestPanel/TestPanel";
import CodeEditor from "./components/CodeEditor/CodeEditor";
import TestList from "./components/TestResult/TestList";
import FileField from './components/FileField/FileField';
import LessonList from './components/Lesson/LessonList';
import SubscribeLinkHandler from './components/LinkHandler/SubscribeLinkHandler';
import CodeLinkHandler from './components/LinkHandler/CodeLinkHandler';

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
    const [code, setCode] = useState(`
        ////
#include <ParallelTesting/TestOptions.h>
#include <ParallelTesting/TestFunctions.h>
#include <TestingData/DataImage.h>
#include <iostream>

void func(RGBImage** img, size_t t, size_t b) {
    for(int y = 0; y < t; y++) {
        for(int x = 0; x < b; x++) {
            img[y][x].R = 255;
        }
    }
}

int main() {
    TestOptions opt(
        {1, 2}, 
        2, 
        Alpha::percent90, 
        IntervalType::CD, 
        CalcValue::Mean, 
        SaveOption::saveAll, 
        true
    );
    DataManager man(DataImage("images.jfif"));
    FunctionManager fm(func);
    TestFunctions test(opt, man, fm);
    test.run();
    return 0;
}
        
        `);
    if (loading) {
        return <div>Загрузка...</div>
    }
      
    return (
        <>
            <Header username={protectedData && protectedData["username"]} />
            <Routes>
                <Route path="*" element={<Preview/>}/>
                <Route path="/lessons" element={<LessonTabPublic/>}/>
                <Route path="/lesson/:id" element={<LessonData />} />
                <Route path="/subscribe/:token" element={<SubscribeLinkHandler />} />
                {protectedData &&
                <>
                    <Route path="/" element={<LessonList role={protectedData["role"]}/>}/>
                    <Route path="/data" element={<FileField/>} />
                    <Route path="/code" element={<CodeEditor code={code} setCode={setCode} editable={true}/>}/>
                    <Route path="/code/:type/:taskId" element={<CodeLinkHandler/>} />
                    <Route path="/results" element={<TestList />}/>
                </>
                }
                {/* <Route path="/test" element={<TestPanel/>}/>
                <Route path="/test/:name" element={<TestPanel/>}/> */}
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