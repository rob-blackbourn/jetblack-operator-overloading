const babelTemplate = require("@babel/template");
const template = babelTemplate.default;

const OperatorOverloadDirectiveName = "operator-overloading";
const ExcludedBinaryOperators = ["===", "!==", "&&", "||", "instanceof"];
const ExcludedUnaryOperators = ["typeof", "void"];

function createBinaryTemplate(op) {
  // Generate a binary expression.
  // This creates an arrow function to replace the binary expression.
  // So:
  //   a + b
  // becomes:
  //   (
  //     () => {
  //       'operator-overloading disabled'
  //       return a !== undefined && a !== null && a[Symbol.for("+")]
  //         ? a[Symbol.for("+")](b)
  //         : a + b
  //     }
  //   )
  //
  // The first instruction is to disable operator overloading the the scope of
  // the arrow function.
  //
  // If the left hand side of the expression has a symbol property for
  // the operator, that function is used to evaluate the binary expression.
  // Otherwise the operator is used for the binary expression.
  return template(`
      (
        () => {
          '${OperatorOverloadDirectiveName} disabled'
          return LHS !== undefined && LHS !== null && LHS[Symbol.for("${op}")]
            ? LHS[Symbol.for("${op}")](RHS)
            : LHS ${op} RHS
        }
      )
  `);
}

function createUnaryTemplate(symbol, op) {
  // See createBinaryTemplate for an explanation of the templates.
  return template(`
  (
    () => {
      '${OperatorOverloadDirectiveName} disabled'
      return ARG !== undefined && ARG !== null && ARG[Symbol.for("${symbol}")]
        ? ARG[Symbol.for("${symbol}")]()
        : ${op} ARG
    }
  )`);
}

function createUpdateTemplate(symbol, op, prefix) {
  // See createBinaryTemplate for an explanation of the templates.
  if (prefix) {
    return template(`
    (
      () => {
        '${OperatorOverloadDirectiveName} disabled'
        return ARG !== undefined && ARG !== null && typeof ARG === 'object' && ARG[Symbol.for("${symbol}")]
          ? ARG[Symbol.for("${symbol}")]()
          : ${op} ARG
      }
    )`);
  } else {
    return template(`
    (
      () => {
        '${OperatorOverloadDirectiveName} disabled'
        return ARG !== undefined && ARG !== null && typeof ARG === 'object' && ARG[Symbol.for("${symbol}")]
          ? ARG[Symbol.for("${symbol}")]()
          : ARG ${op}
      }
    )`);
  }
}

function createDeleteExpressionStatement(t, argument) {
  // See createBinaryTemplate for an explanation of the templates.
  if (argument.property.type === "StringLiteral") {
    const deleteTemplate = template(`
    (
      () => {
        '${OperatorOverloadDirectiveName} disabled'
        return OBJECT !== undefined && OBJECT !== null && OBJECT[Symbol.for("delete")]
          ? OBJECT[Symbol.for("delete")](KEY)
          : delete OBJECT[KEY]
      }
    )`);
    return deleteTemplate({
      OBJECT: argument.object,
      KEY: argument.property,
    });
  } else if (argument.property.type === "Identifier") {
    const deleteTemplate = template(`
    (
      () => {
        '${OperatorOverloadDirectiveName} disabled'
        return OBJECT !== undefined && OBJECT !== null && OBJECT[Symbol.for("delete")]
          ? OBJECT[Symbol.for("delete")](KEY)
          : delete OBJECT.PROPERTY
      }
    )`);
    return deleteTemplate({
      OBJECT: argument.object,
      KEY: t.stringLiteral(argument.property.name),
      PROPERTY: argument.property,
    });
  } else {
    throw Error(`Unhandled property type ${argument.property.type}`);
  }
}

function hasDirective(directives, name, values) {
  // A directive may be present or absent. If absent the result is undefined. If
  // present, the optional argument is used as a property index to the values
  // argument and the result returned.
  for (const directive of directives) {
    if (directive.value.value.startsWith(name)) {
      const setting = directive.value.value
        .substring(name.length)
        .trim()
        .toLowerCase();
      return values[setting];
    }
  }
  return undefined;
}

function hasOverloadingDirective(directives) {
  return hasDirective(directives, OperatorOverloadDirectiveName, {
    enabled: true,
    disabled: false,
  });
}

function initDirectives(state) {
  // Create a property to store the plugin state.
  if (state.dynamicData === undefined) {
    state.dynamicData = {};
  }

  if (!state.dynamicData.hasOwnProperty(OperatorOverloadDirectiveName)) {
    // Initialize the plugin state with directives. This is a stack
    // (using a list) which indicates whether operator overloading is
    // enabled.
    state.dynamicData[OperatorOverloadDirectiveName] = {
      directives: [],
    };
  }

  return state.dynamicData[OperatorOverloadDirectiveName].directives;
}

function getDirectives(state) {
  return state.dynamicData[OperatorOverloadDirectiveName].directives;
}

module.exports = function ({ types: t }) {
  return {
    visitor: {
      Program: {
        enter(path, state) {
          const directives = initDirectives(state);

          // Check the directives to see whether operator overloading is enabled.
          switch (hasOverloadingDirective(path.node.directives)) {
            case true:
              // The operator overloading directive is present and enabled.
              directives.unshift(true);
              break;
            case false:
              // The operator overloading directive is present and disabled.
              directives.unshift(false);
              break;
            default:
              // The operator overloading directive is absent. Check the plugin
              // option to determine whether to enable operator overloading.
              directives.unshift(
                state.opts.enabled == undefined
                  ? false // Default to false.
                  : state.opts.enabled
              );
              break;
          }
        },
        exit(path, state) {
          const directives = getDirectives(state);

          if (hasOverloadingDirective(path.node.directives) !== false) {
            // Unstack the enabled/disabled state.
            directives.shift();
          }
        },
      },

      BlockStatement: {
        enter(path, state) {
          const directives = getDirectives(state);

          switch (hasOverloadingDirective(path.node.directives)) {
            case true:
              directives.unshift(true);
              break;
            case false:
              directives.unshift(false);
              break;
          }
        },
        exit(path, state) {
          const directives = getDirectives(state);

          switch (hasOverloadingDirective(path.node.directives)) {
            case true:
            case false:
              directives.shift();
              break;
          }
        },
      },

      BinaryExpression(path, state) {
        const directives = getDirectives(state);

        if (!directives[0]) {
          return;
        }

        if (ExcludedBinaryOperators.includes(path.node.operator)) {
          return;
        }

        const expressionStatement = createBinaryTemplate(path.node.operator)({
          LHS: path.node.left,
          RHS: path.node.right,
        });

        path.replaceWith(t.callExpression(expressionStatement.expression, []));
      },

      UpdateExpression(path, state) {
        const directives = getDirectives(state);

        if (!directives[0]) {
          return;
        }

        const symbol =
          (path.node.prefix ? "prefix-" : "postfix-") +
          (path.node.operator == "++" ? "increment" : "decrement");

        const expressionTemplate = createUpdateTemplate(
          symbol,
          path.node.operator,
          path.node.prefix
        );
        const expressionStatement = expressionTemplate({
          ARG: path.node.argument,
        });

        path.replaceWith(t.callExpression(expressionStatement.expression, []));
      },

      UnaryExpression(path, state) {
        const directives = getDirectives(state);

        if (!directives[0]) {
          return;
        }

        if (ExcludedUnaryOperators.includes(path.node.operator)) {
          return;
        }

        const symbolOverrides = { "+": "plus", "-": "minus" };
        const symbol =
          path.node.operator in symbolOverrides
            ? symbolOverrides[path.node.operator]
            : path.node.operator;

        const expressionStatement =
          symbol === "delete"
            ? createDeleteExpressionStatement(t, path.node.argument)
            : createUnaryTemplate(
                symbol,
                path.node.operator
              )({
                ARG: path.node.argument,
              });

        path.replaceWith(t.callExpression(expressionStatement.expression, []));
      },

      AssignmentExpression(path, state) {
        const directives = getDirectives(state);

        if (!directives[0]) {
          return;
        }

        if (path.node.operator === "=") {
          return;
        }

        const operator = path.node.operator.slice(
          0,
          path.node.operator.length - 1
        );

        const expressionStatement = createBinaryTemplate(operator)({
          LHS: path.node.left,
          RHS: path.node.right,
        });

        const callExpression = t.callExpression(
          expressionStatement.expression,
          []
        );

        path.replaceWith(
          t.assignmentExpression("=", path.node.left, callExpression)
        );
      },
    },
  };
};
