我国 IT 界历来有一个汉语编程梦，虽然各方对于汉语编程争论不休，甚至上升到民族大义的高度，本文不讨论其对与错，但我们不妨来尝试一下，定义一个简单的中文编程语法。

在设计模式中，解释器模式就是用来自定义语法的，它的定义如下。

> 解释器模式（Interpreter Pattern）：给定一门语言，定义它的文法的一种表示，并定义一个解释器，该解释器使用该表示来解释语言中的句子。

解释器模式较为晦涩难懂，但本文我们仍然深入浅出，通过一个简单的例子来学习解释器模式：使用中文编写出十以内的加减法公式。比如：

- 输入“一加一”，输出结果 2
- 输入“一加一加一”，输出结果 3
- 输入“二加五减三”，输出结果 4
- 输入“七减五加四减一”，输出结果 5
- 输入“九减五加三减一”，输出结果 6

看到这个需求，我们很容易想到一种写法：将输入的字符串分割成单个字符，把数字字符通过switch-case转换为数字，再通过计算符判断是加法还是减法，对应做加、减计算，最后返回结果即可。

的确可行，但这实在太面向过程了。众所周知，面向过程编程会有耦合度高，不易扩展等缺点。接下来我们尝试按照面向对象的写法来实现这个功能。

按照面向对象的编程思想，我们应该为公式中不同种类的元素建立一个对应的对象。那么我们先分析一下公式中的成员：

- 数字：零到九对应 0 ~ 9
- 计算符：加、减对应+、-

公式中仅有这两种元素，其中对于数字的处理比较简单，只需要通过 switch-case 将中文名翻译成阿拉伯数字即可。

计算符怎么处理呢？计算符左右两边可能是单个数字，也可能是另一个计算公式。但无论是数字还是公式，两者都有一个共同点，那就是他们都会返回一个整数：数字返回其本身，公式返回其计算结果。

所以我们可以根据这个共同点提取出一个返回整数的接口，数字和计算符都作为该接口的实现类。在计算时，使用栈结构存储数据，将数字和计算符统一作为此接口的实现类压入栈中计算。

> talk is cheap, show me the code.

数字和计算符公共的接口：

```Java
interface Expression {
    int interpret();
}
```
上文已经说到，数字和计算符都属于表达式的一部分，他们的共同点是都会返回一个整数。从表达式计算出整数的过程，我们称之为解释（interpret）。

对数字类的解释实现起来相对比较简单：

```Java
public class Number implements Expression {
    int number;

    public Number(char word) {
        switch (word) {
            case '零':
                number = 0;
                break;
            case '一':
                number = 1;
                break;
            case '二':
                number = 2;
                break;
            case '三':
                number = 3;
                break;
            case '四':
                number = 4;
                break;
            case '五':
                number = 5;
                break;
            case '六':
                number = 6;
                break;
            case '七':
                number = 7;
                break;
            case '八':
                number = 8;
                break;
            case '九':
                number = 9;
                break;
            default:
                break;
        }
    }

    @Override
    public int interpret() {
        return number;
    }
}
```
在 Number 类的构造函数中，先将传入的字符转换为对应的数字。在解释时将转换后的数字返回即可。

无论是加法还是减法，他们都是对左右两个表达式进行操作，所以我们可以将计算符提取出共同的抽象父类：

```Java
abstract class Operator implements Expression {
    Expression left;
    Expression right;

    Operator(Expression left, Expression right) {
        this.left = left;
        this.right = right;
    }
}
```
在此抽象父类中，我们存入了两个变量，表达计算符左右两边的表达式。

加法类实现如下：

```Java
class Add extends Operator {

    Add(Expression left, Expression right) {
        super(left, right);
    }

    @Override
    public int interpret() {
        return left.interpret() + right.interpret();
    }
}
```
减法类：

```Java
class Sub extends Operator {

    Sub(Expression left, Expression right) {
        super(left, right);
    }

    @Override
    public int interpret() {
        return left.interpret() - right.interpret();
    }
}
```
加法类和减法类都继承自 Operator 类，在对他们进行解释时，将左右两边表达式解释出的值相加或相减即可。

数字类和计算符内都定义好了，这时我们只需要再编写一个计算类将他们综合起来，统一计算即可。

计算类：

```Java
class Calculator {
    int calculate(String expression) {
        Stack<Expression> stack = new Stack<>();
        for (int i = 0; i < expression.length(); i++) {
            char word = expression.charAt(i);
            switch (word) {
                case '加':
                    stack.push(new Add(stack.pop(), new Number(expression.charAt(++i))));
                    break;
                case '减':
                    stack.push(new Sub(stack.pop(), new Number(expression.charAt(++i))));
                    break;
                default:
                    stack.push(new Number(word));
                    break;
            }
        }
        return stack.pop().interpret();
    }
}
```
在计算类中，我们使用栈结构保存每一步操作。遍历 expression 公式：

- 遇到数字则将其压入栈中；
- 遇到计算符时，先将栈顶元素 pop 出来，再和下一个数字一起传入计算符的构造函数中，组成一个计算符公式压入栈中。
![[1604308240-LsAMOW-4.gif]]

需要注意的是，入栈出栈过程并不会执行真正的计算，栈操作只是将表达式组装成一个嵌套的类对象而已。比如：

- “一加一”表达式，经过入栈出栈操作后，生成的对象是 new Add(new Number('一'), new Number('一'))
- “二加五减三”表达式，经过入栈出栈操作后，生成的对象是 new Sub(new Add(new Number('二'), new Number('五')), new Number('三'))
最后一步 stack.pop().interpret()，将栈顶的元素弹出，执行 interpret() ，这时才会执行真正的计算。计算时会将中文的数字和运算符分别解释成计算机能理解的指令。

测试类：

```Java
public class Client {
    @Test
    public void test() {
        Calculator calculator = new Calculator();
        String expression1 = "一加一";
        String expression2 = "一加一加一";
        String expression3 = "二加五减三";
        String expression4 = "七减五加四减一";
        String expression5 = "九减五加三减一";
        // 输出： 一加一 等于 2
        System.out.println(expression1 + " 等于 " + calculator.calculate(expression1));
        // 输出： 一加一加一 等于 3
        System.out.println(expression2 + " 等于 " + calculator.calculate(expression2));
        // 输出： 二加五减三 等于 4
        System.out.println(expression3 + " 等于 " + calculator.calculate(expression3));
        // 输出： 七减五加四减一 等于 5
        System.out.println(expression4 + " 等于 " + calculator.calculate(expression4));
        // 输出： 九减五加三减一 等于 6
        System.out.println(expression5 + " 等于 " + calculator.calculate(expression5));
    }
}
```
这就是解释器模式，我们将一句中文的公式解释给计算机，然后计算机为我们运算出了正确的结果。

分析本例中公式的组成，我们可以发现几条显而易见的性质：

- 数字类不可被拆分，属于计算中的最小单元；
- 加法类、减法类可以被拆分成两个数字（或两个公式）加一个计算符，他们不是计算的最小单元。

在解释器模式中，我们将不可拆分的最小单元称之为终结表达式，可以被拆分的表达式称之为非终结表达式。

解释器模式具有一定的拓展性，当需要添加其他计算符时，我们可以通过添加 Operator 的子类来完成。但添加后需要按照运算优先级修改计算规则。可见一个完整的解释器模式是非常复杂的，实际开发中几乎没有需要自定义解释器的情况。

解释器模式有一个常见的应用，在我们平时匹配字符串时，用到的正则表达式就是一个解释器。