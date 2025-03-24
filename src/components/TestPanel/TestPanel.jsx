import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GeneralOptions from './GeneralOptions/GeneralOptions';
import ParametersOptions from './ParameterOptions/ParametersOptions';
import axios from '/src/config/axiosCompilerConfig.js';

const TestPanel = () => {
    const { name } = useParams();
    const navigate = useNavigate();
    const [options, setOptions] = useState(null);
    const [declaration, setDeclaration] = useState(null);
    const [parameterSets, setParameterSets] = useState([]);
    const [functionsDeclarations, setFunctionsDeclarations] = useState([]); 
    console.log(parameterSets);
    const code = `
    #include <vector>
        enum En {
            one,
            two
        };
        std::vector<int> ver;
        int add(int* a, unsigned long size, int first, En en, bool th, double time, std::vector<int> str) {
            return 0;
        }
        int addd(int* a, unsigned long size, int first, En en, int* vcx) {
            return 0;
        }
    `
    
    useEffect(() => {
        const fetchGetFunctionsDeclarations = async () => {
            try {
                const data = {
                    "code": code
                }
                const response = await axios.post('/functions', data, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                
                if (response.data.stdout)
                setFunctionsDeclarations(response.data.stdout.functions);
            } catch (error) {
                console.error("Getting functions declarations error:", error);
            }
        }
        fetchGetFunctionsDeclarations();
    }, []);

    const handleOpenFunctionOptionsClick = (declaration) => {
        setDeclaration(declaration);
        setOptions(null);
        setParameterSets([]);
        navigate(`/test/function/${declaration.name}`);
    };

    return (
        <div>
            {functionsDeclarations && functionsDeclarations.map((declaration, id) => (
                <button key={id} onClick={() => handleOpenFunctionOptionsClick(declaration)}>
                    {declaration.name}
                </button>
            ))}
        {name && (
            <div style={{display: "flex"}}>
                <GeneralOptions
                    declaration={declaration}
                    onOptionsChange={setOptions}
                />
                <ParametersOptions
                    declaration={declaration}
                    onParameterSetChange={setParameterSets}
                />
            </div>
        )}
        </div>
    )
}

export default TestPanel;