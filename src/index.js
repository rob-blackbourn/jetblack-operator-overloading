const babelTemplate = require('@babel/template')
const template = babelTemplate.default

const OperatorOverloadDirectiveName = 'operator-overloading'

function createBinaryTemplate(op) {
  return template(`
      (
        () => {
          '${OperatorOverloadDirectiveName} disabled'
          return LHS !== undefined && LHS !== null && LHS[Symbol.for("${op}")]
            ? LHS[Symbol.for("${op}")](RHS)
            : LHS ${op} RHS
        }
      )
  `)
}

function createUnaryTemplate(symbol, op) {
  return template(`
  (
    () => {
      '${OperatorOverloadDirectiveName} disabled'
      return ARG !== undefined && ARG !== null && ARG[Symbol.for("${symbol}")]
        ? ARG[Symbol.for("${symbol}")]()
        : ${op} ARG
    }
  )`)
}

function createUpdateTemplate(symbol, op, prefix) {
  if (prefix) {
    return template(`
    (
      () => {
        '${OperatorOverloadDirectiveName} disabled'
        return ARG !== undefined && ARG !== null && typeof ARG === 'object' && ARG[Symbol.for("${symbol}")]
          ? ARG[Symbol.for("${symbol}")]()
          : ${op} ARG
      }
    )`)
  } else {
    return template(`
    (
      () => {
        '${OperatorOverloadDirectiveName} disabled'
        return ARG !== undefined && ARG !== null && typeof ARG === 'object' && ARG[Symbol.for("${symbol}")]
          ? ARG[Symbol.for("${symbol}")]()
          : ARG ${op}
      }
    )`)
  }
}

function createDeleteExpressionStatement(t, argument) {
  if (argument.property.type === 'StringLiteral') {
    const deleteTemplate = template(`
    (
      () => {
        '${OperatorOverloadDirectiveName} disabled'
        return OBJECT !== undefined && OBJECT !== null && OBJECT[Symbol.for("delete")]
          ? OBJECT[Symbol.for("delete")](KEY)
          : delete OBJECT[KEY]
      }
    )`)
    return deleteTemplate({
      OBJECT: argument.object,
      KEY: argument.property
    })
  } else if (argument.property.type === 'Identifier') {
    const deleteTemplate = template(`
    (
      () => {
        '${OperatorOverloadDirectiveName} disabled'
        return OBJECT !== undefined && OBJECT !== null && OBJECT[Symbol.for("delete")]
          ? OBJECT[Symbol.for("delete")](KEY)
          : delete OBJECT.PROPERTY
      }
    )`)
    return deleteTemplate({
      OBJECT: argument.object,
      KEY: t.stringLiteral(argument.property.name),
      PROPERTY: argument.property
    })
  } else {
    throw Error(`Unhandled property type ${argument.property.type}`)
  }
}
function hasDirective(directives, name, values) {
  for (const directive of directives) {
    if (directive.value.value.startsWith(name)) {
      const setting = directive.value.value.substring(name.length).trim().toLowerCase()
      return values[setting]
    }
  }
  return undefined
}

function hasOverloadingDirective(directives) {
  return hasDirective(directives, OperatorOverloadDirectiveName, { 'enabled': true, 'disabled': false })
}

module.exports = function ({ types: t }) {
  return {
    visitor: {

      Program: {
        enter(path, state) {

          if (state.dynamicData === undefined) {
            state.dynamicData = {}
          }

          if (!state.dynamicData.hasOwnProperty(OperatorOverloadDirectiveName)) {
            state.dynamicData[OperatorOverloadDirectiveName] = {
              directives: []
            }
          }

          switch (hasOverloadingDirective(path.node.directives)) {
            case true:
              state.dynamicData[OperatorOverloadDirectiveName].directives.unshift(true)
              break;
            case false:
              state.dynamicData[OperatorOverloadDirectiveName].directives.unshift(false)
              break;
            default:
              // Default to false.
              state.dynamicData[OperatorOverloadDirectiveName].directives.unshift(state.opts.enabled == undefined ? false : state.opts.enabled)
              break;
          }
        },
        exit(path, state) {
          if (hasOverloadingDirective(path.node.directives) !== false) {
            state.dynamicData[OperatorOverloadDirectiveName].directives.shift()
          }
        }
      },

      BlockStatement: {
        enter(path, state) {
          switch (hasOverloadingDirective(path.node.directives)) {
            case true:
              state.dynamicData[OperatorOverloadDirectiveName].directives.unshift(true)
              break
            case false:
              state.dynamicData[OperatorOverloadDirectiveName].directives.unshift(false)
              break
          }
        },
        exit(path, state) {
          switch (hasOverloadingDirective(path.node.directives)) {
            case true:
            case false:
              state.dynamicData[OperatorOverloadDirectiveName].directives.shift()
              break
          }
        }
      },

      BinaryExpression(path, state) {

        if (!state.dynamicData[OperatorOverloadDirectiveName].directives[0]) {
          return
        }

        if (path.node.operator.endsWith('===') || 
            path.node.operator == '&&' ||
            path.node.operator == '||' ||
            path.node.operator == 'instanceof') {
          return
        }

        const expressionStatement = createBinaryTemplate(path.node.operator)({
          LHS: path.node.left,
          RHS: path.node.right
        })

        path.replaceWith(
          t.callExpression(
            expressionStatement.expression,
            []
          )
        )
      },

      UpdateExpression(path, state) {

        if (!state.dynamicData[OperatorOverloadDirectiveName].directives[0]) {
          return
        }

        const symbol = (path.node.prefix ? 'prefix-' : 'postfix-')
          + (path.node.operator == '++' ? 'increment' : 'decrement')

        const expressionTemplate = createUpdateTemplate(symbol, path.node.operator, path.node.prefix)
        const expressionStatement = expressionTemplate({
            ARG: path.node.argument,
        })

        path.replaceWith(
          t.callExpression(
            expressionStatement.expression,
            []
          )
        )
      },

      UnaryExpression(path, state) {

        if (!state.dynamicData[OperatorOverloadDirectiveName].directives[0]) {
          return
        }

        if (path.node.operator == 'typeof' ||
            path.node.operator == 'void') {
          return
        }

        const symbolOverrides = {'+': 'plus', '-': 'minus'}
        const symbol = path.node.operator in symbolOverrides
          ? symbolOverrides[path.node.operator]
          : path.node.operator

        const expressionStatement = symbol === 'delete'
          ? createDeleteExpressionStatement(t, path.node.argument)
          : createUnaryTemplate(symbol, path.node.operator)({
              ARG: path.node.argument,
            })

        path.replaceWith(
          t.callExpression(
            expressionStatement.expression,
            []
          )
        )
      },

      AssignmentExpression(path, state) {

        if (!state.dynamicData[OperatorOverloadDirectiveName].directives[0]) {
          return
        }

        if (path.node.operator === "=") {
          return
        }

        const operator = path.node.operator.slice(0,path.node.operator.length - 1)

        const expressionStatement = createBinaryTemplate(operator)({
          LHS: path.node.left,
          RHS: path.node.right
        })

        const callExpression = t.callExpression(
          expressionStatement.expression,
          []
        )

        path.replaceWith(
          t.assignmentExpression(
            '=',
            path.node.left,
            callExpression))
      }
    }
  }
}