import React, { useState } from "react";

const JavaFileGenerator = () => {
  const [fileName, setFileName] = useState("");
  const [isClass, setIsClass] = useState(true);
  const [useLombok, setUseLombok] = useState(false);
  const [methods, setMethods] = useState([]);
  const [generatedCode, setGeneratedCode] = useState("");

  const addMethod = () => {
    setMethods([
      ...methods,
      {
        name: "",
        accessModifier: "public",
        returnType: "void",
        parameters: "",
      },
    ]);
  };

  const updateMethod = (index, field, value) => {
    const updatedMethods = [...methods];
    updatedMethods[index] = { ...updatedMethods[index], [field]: value };
    setMethods(updatedMethods);
  };

  const generateCode = () => {
    let code = "";
    if (useLombok) {
      code += "@Getter\n@Setter\n";
    }
    code += `public ${isClass ? "class" : "interface"} ${fileName} {\n\n`;

    methods.forEach((method) => {
      code += `    ${method.accessModifier} ${method.returnType} ${method.name}(${method.parameters})`;
      if (isClass) {
        code += ` {\n        // TODO: Implement method\n    }\n\n`;
      } else {
        code += ";\n\n";
      }
    });

    code += "}";
    setGeneratedCode(code);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Java File Generator</h1>

      <div className="mb-4">
        <label className="block mb-2">
          File Name (Class/Interface Name):
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </label>
      </div>

      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isClass}
            onChange={(e) => setIsClass(e.target.checked)}
            className="mr-2"
          />
          Is Class (unchecked for interface)
        </label>
      </div>

      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={useLombok}
            onChange={(e) => setUseLombok(e.target.checked)}
            className="mr-2"
          />
          Use Lombok
        </label>
      </div>

      {methods.map((method, index) => (
        <div key={index} className="border p-4 mb-4 rounded">
          <h3 className="text-lg font-semibold mb-2">Method {index + 1}</h3>
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              Method Name:
              <input
                type="text"
                value={method.name}
                onChange={(e) => updateMethod(index, "name", e.target.value)}
                className="w-full p-2 border rounded"
              />
            </label>
            <label className="block">
              Access Modifier:
              <input
                type="text"
                value={method.accessModifier}
                onChange={(e) =>
                  updateMethod(index, "accessModifier", e.target.value)
                }
                className="w-full p-2 border rounded"
              />
            </label>
            <label className="block">
              Return Type:
              <input
                type="text"
                value={method.returnType}
                onChange={(e) =>
                  updateMethod(index, "returnType", e.target.value)
                }
                className="w-full p-2 border rounded"
              />
            </label>
            <label className="block">
              Parameters:
              <input
                type="text"
                value={method.parameters}
                onChange={(e) =>
                  updateMethod(index, "parameters", e.target.value)
                }
                className="w-full p-2 border rounded"
              />
            </label>
          </div>
        </div>
      ))}

      <button
        onClick={addMethod}
        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
      >
        Add Method
      </button>
      <button
        onClick={generateCode}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Generate Code
      </button>

      <div className="mt-4">
        <label className="block mb-2">
          Generated Code:
          <textarea
            value={generatedCode}
            readOnly
            className="w-full p-2 border rounded h-64"
          />
        </label>
      </div>
    </div>
  );
};

export default JavaFileGenerator;
