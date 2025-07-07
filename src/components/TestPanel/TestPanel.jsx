import { useState, useEffect, useContext } from 'react';
import { Context } from '/src/Context';
import GeneralOptions from './GeneralOptions/GeneralOptions';
import ParametersOptions from './ParameterOptions/ParametersOptions';
import FileField from '../FileField/FileField';
import axios from '/src/config/axiosCompilerConfig.js';
import Dialog from '../Dialog/Dialog';
import styles from './TestPanel.module.css';

const TestPanel = ({threadNumber = 1, code, open, onNoClick, onYesClick}) => {
    const [name, setName] = useState(null);
    const { protectedData } = useContext(Context);
    const [options, setOptions] = useState(null);
    const [declaration, setDeclaration] = useState(null);
    const [parameterSets, setParameterSets] = useState([]);
    const [functionsDeclarations, setFunctionsDeclarations] = useState([]); 
    const [selectItems, setSelectItems] = useState([]);
    
    useEffect(() => {
        const splitByType = (array) => {
            const result = [];
            
            for (const item of array) {
              if (typeof item.type === 'string' && item.type.split(' ').length === 2) {
                const [type1, type2] = item.type.split(' ');
                
                const item1 = { ...item, type: type1, name: `${item.name}(${type1})` };
                const item2 = { ...item, type: type2, name: `${item.name}(${type2})` };
                
                result.push(item1, item2);
              } else {
                result.push(item);
              }
            }
            
            return result;
        };

        const fetchGetFunctionsDeclarations = async () => {
            try {
                const data = {
                    "user_id": protectedData.id,
                    "code": code
                }
                const response = await axios.post('/functions', data, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                console.log(response.data.functions);
                if (response.data.functions){
                    const functions = response.data.functions.filter(func => func.type !== 'unknown');
                    setFunctionsDeclarations(splitByType(functions));
                }
            } catch (error) {
                console.error("Getting functions declarations error:", error);
            }
        }
        fetchGetFunctionsDeclarations();
    }, [code]);

    const handleOpenFunctionOptionsClick = (declaration) => {
        declaration.name = declaration.name.split("(")[0];
        declaration.type = declaration.type.split("(")[0];
        setDeclaration(declaration);
        setOptions(null);
        setParameterSets([]);
        setName(declaration.name);
    };

    const handleGenerateClick = async () => {
        const data = {
            files: selectItems,
            options: options,
            parameters: parameterSets.map(set => set.parameters),
            name: declaration.name,
            type: declaration.type,
            code: code
        };
        console.log(data)
        try {
            const response = await axios.post('/generate', data, {
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            
            onYesClick(response.data);
        } catch (error) {
            console.error('Generate test error', error);
        }
    }

    const handleNoClick = async () => {
        setDeclaration(null);
        setName(null);
        onNoClick();
    }
    
    return (
        <Dialog title="Генератор тестов" style={{width: "90vw"}} open={open} onNoClick={handleNoClick} onYesClick={handleGenerateClick}>
            {(functionsDeclarations && name === null) && <div className={styles.selection}>
                <p>Выберите функцию: </p>
                {functionsDeclarations.map((declaration, id) => (
                    <>
                        <button key={id} onClick={() => handleOpenFunctionOptionsClick(declaration)}>
                            {declaration.name}
                        </button>
                        {id < functionsDeclarations.length - 1 && <span key={id + functionsDeclarations.length} className={styles.separator}>|</span>}
                    </>
                ))}
            </div>}
        {name && (
            <div style={{display: "flex", height: "90%"}}>
                <GeneralOptions
                    threadNumber={threadNumber}
                    declaration={declaration}
                    onOptionsChange={setOptions}
                />
                <ParametersOptions
                    declaration={declaration}
                    onParameterSetChange={setParameterSets}
                />
                <FileField style={{height: "90%", width: "60%"}} selectItems={selectItems} onSelectItems={setSelectItems} type={declaration.type}/>
            </div>
        )}
        </Dialog>
    )
}

export default TestPanel;