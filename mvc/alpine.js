const messages = {
  copy: "복사",
  copyDone: "복사가 완료되었습니다.",
};

function app() {
  return {
    fileName: "",
    // 컨트롤러
    controller: {
      open: true, // 컨트롤러 토글
      useLogger: true,
      clipboard: {
        textPrint: messages.copy,
        copied: false,
      },
      controllerCode: "",
      toggle() {
        this.controller.open = !this.controller.open;
      },
      copyToClipBoard() {
        if (this.controller.clipboard.copied === false) {
          navigator.clipboard
            .writeText(this.controller.controllerCode)
            .then(() => {
              this.controller.clipboard.copied = true;
              this.controller.clipboard.textPrint = messages.copyDone;
              setTimeout(() => {
                this.controller.clipboard.copied = false;
                this.controller.clipboard.textPrint = messages.copy;
              }, 2000);
            })
            .catch((err) => {
              console.log("Something went wrong", err);
            });
        }
      },
      generateController() {
        const tab = "\t";
        const className = `${this.fileName}Controller`;

        const codeLines = [];
        codeLines.push("import org.springframework.stereotype.Controller;");
        codeLines.push("@Controller");
        codeLines.push(`public class ${className} {`);

        if (this.controller.useLogger) {
          codeLines.unshift("import org.slf4j.Logger;");
          codeLines.unshift("import org.slf4j.LoggerFactory;");
          codeLines.push(
            `${tab}private static final Logger LOGGER = LoggerFactory.getLogger(${className}.class);`
          );
        }

        // 변수 추가
        this.controller.variables.forEach((variable) => {
          if (variable.type && variable.name) {
            if (variable.annotation === "@Autowired") {
              codeLines.unshift(
                "import org.springframework.beans.factory.annotation.Autowired;"
              );
              codeLines.push(`${tab}@Autowired`);
            }
            codeLines.push(
              `${tab}${variable.accessModifier} ${variable.type} ${variable.name};`
            );
          }
        });

        // 메서드 추가
        this.controller.methods.forEach((method) => {
          if (method.returnType && method.name) {
            codeLines.push(
              `${tab}${method.accessModifier} ${method.returnType} ${method.name}(${method.parameters})`
            );
            const len = codeLines.length;
            if (method.exception) {
              codeLines[len - 1] += ` throws ${method.exception}`;
            }
            codeLines[len - 1] += " {";
            codeLines.push(`${tab}}`);
          }
        });

        codeLines.push("}");

        this.controller.controllerCode = codeLines.join("\n");
      },

      //   변수
      openVariables: true,
      variables: [],
      variablesCnt: 1,
      addVariable() {
        for (let i = 0; i < this.controller.variablesCnt; i++) {
          const variables = this.controller.variables;
          const id =
            variables.length > 0
              ? Math.max(...variables.map((m) => m.id)) + 1
              : 1;
          variables.push({
            id,
            accessModifier: "private",
            type: "",
            name: "",
            annotation: "",
          });
        }
      },
      deleteVariable(id) {
        this.variables = this.variables.filter((m) => m.id !== id);
      },
      toggleVariables() {
        this.controller.openVariables = !this.controller.openVariables;
      },

      //   메서드
      openMethods: true,
      methods: [],
      methodsCnt: 1,
      addMethods() {
        for (let i = 0; i < this.controller.methodsCnt; i++) {
          const methods = this.controller.methods;
          const id =
            methods.length > 0 ? Math.max(...methods.map((m) => m.id)) + 1 : 1;
          methods.push({
            id,
            name: "",
            accessModifier: "public",
            returnType: "void",
            parameters: "",
            exception: "",
          });
        }
      },
      deleteMethod(id) {
        this.methods = this.methods.filter((m) => m.id !== id);
      },
      toggleMethods() {
        this.controller.openMethods = !this.controller.openMethods;
      },
    },
    // 서비스
    service: {
      open: true,
      clipboardService: {
        textPrint: messages.copy,
        copied: false,
      },
      clipboardServiceImpl: {
        textPrint: messages.copy,
        copied: false,
      },
      serviceCode: "",
      serviceImplCode: "",
      toggle() {
        this.service.open = !this.service.open;
      },
      copyServiceToClipBoard() {
        if (this.service.clipboardService.copied === false) {
          navigator.clipboard
            .writeText(this.service.serviceCode)
            .then(() => {
              this.service.clipboardService.copied = true;
              this.service.clipboardService.textPrint = messages.copyDone;
              setTimeout(() => {
                this.service.clipboardService.copied = false;
                this.service.clipboardService.textPrint = messages.copy;
              }, 2000);
            })
            .catch((err) => {
              console.log("Something went wrong", err);
            });
        }
      },
      copyServiceImplToClipBoard() {
        if (this.service.clipboardServiceImpl.copied === false) {
          navigator.clipboard
            .writeText(this.service.serviceImplCode)
            .then(() => {
              this.service.clipboardServiceImpl.copied = true;
              this.service.clipboardServiceImpl.textPrint = messages.copyDone;
              setTimeout(() => {
                this.service.clipboardServiceImpl.copied = false;
                this.service.clipboardServiceImpl.textPrint = messages.copy;
              }, 2000);
            })
            .catch((err) => {
              console.log("Something went wrong", err);
            });
        }
      },
      generate() {
        this.service.generateService.call(this);
        this.service.generateServiceImpl.call(this);
      },
      generateService() {
        const tab = "\t";
        const interfaceName = `${this.fileName}Service`;

        const codeLines = [];
        codeLines.push(`public interface ${interfaceName} {`);

        // 메서드 추가
        this.service.methods.forEach((method) => {
          if (method.returnType && method.name) {
            codeLines.push(
              `${tab}${method.accessModifier} ${method.returnType} ${method.name}(${method.parameters});`
            );
            if (method.exception) {
              const len = codeLines.length;
              codeLines[len - 1] = codeLines[len - 1].replace(/;$/, "");
              codeLines[len - 1] += ` throws ${method.exception};`;
            }
          }
        });

        codeLines.push("}");

        this.service.serviceCode = codeLines.join("\n");
      },
      generateServiceImpl() {
        const tab = "\t";
        const className = `${this.fileName}ServiceImpl`;

        const codeLines = [];
        codeLines.push(`public class ${className} {`);

        // 메서드 추가
        this.service.methods.forEach((method) => {
          if (method.returnType && method.name) {
            codeLines.push(
              `${tab}${method.accessModifier} ${method.returnType} ${method.name}(${method.parameters})`
            );
            const len = codeLines.length;
            if (method.exception) {
              codeLines[len - 1] += ` throws ${method.exception}`;
            }
            codeLines[len - 1] += " {";
            codeLines.push(`${tab}}`);
          }
        });

        codeLines.push("}");

        this.service.serviceImplCode = codeLines.join("\n");
      },

      //   메서드
      openMethods: true,
      methods: [],
      methodsCnt: 1,
      addMethods() {
        for (let i = 0; i < this.service.methodsCnt; i++) {
          const methods = this.service.methods;
          const id =
            methods.length > 0 ? Math.max(...methods.map((m) => m.id)) + 1 : 1;
          methods.push({
            id,
            name: "",
            accessModifier: "public",
            returnType: "void",
            parameters: "",
            exception: "",
          });
        }
      },
      deleteMethod(id) {
        this.methods = this.methods.filter((m) => m.id !== id);
      },
      toggleMethods() {
        this.service.openMethods = !this.service.openMethods;
      },
    },
  };
}
