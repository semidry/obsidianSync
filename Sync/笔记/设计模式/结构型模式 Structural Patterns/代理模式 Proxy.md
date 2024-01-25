现在我们有一个人类，他整天就只负责吃饭、睡觉：
![[1604307189-OFDXil-3.gif]]

人类的接口

```Java
Public interface IPerson {
    Void eat ();
    Void sleep ();
}
```

人类：

```Java
Public class Person implements IPerson{

    @Override
    public void eat() {
        System.out.println("我在吃饭");
    }

    @Override
    public void sleep() {
        System.out.println("我在睡觉");
    }
}
```

客户端测试：

```Java
Public class Client {
    @Test
    Public void test () {
        Person person = new Person ();
        Person.Eat ();
        Person.Sleep ();
    }
}
```

运行程序，输出如下：


```
我在吃饭
我在睡觉
```

我们可以把这个类包装到另一个类中，实现完全一样的行为：

```Java
Public class PersonProxy implements IPerson {

    private final Person person;

    public PersonProxy(Person person) {
        this.person = person;
    }

    @Override
    public void eat() {
        person.eat();
    }

    @Override
    public void sleep() {
        person.sleep();
    }
}
```

将客户端修改为调用这个新的类：

```Java
Public class Client {
    @Test
    Public void test () {
        Person person = new Person ();
        PersonProxy proxy = new PersonProxy (person);
        Proxy.Eat ();
        Proxy.Sleep ();
    }
}
```

运行程序，输出如下：


```
我在吃饭
我在睡觉
```

这就是代理模式。

笔者力图用最简洁的代码讲解此模式，只要理解了上述这个简单的例子，你就知道代理模式是怎么一回事了。我们在客户端和 Person 类之间新增了一个中间件 PersonProxy，这个类就叫做代理类，他实现了和 Person 类一模一样的行为。

代理模式：给某一个对象提供一个代理，并由代理对象控制对原对象的引用。

现在这个代理类还看不出任何意义，我们来模拟一下工作中的需求。在实际工作中，我们可能会遇到这样的需求：在网络请求前后，分别打印将要发送的数据和接收到数据作为日志信息。此时我们就可以新建一个网络请求的代理类，让它代为处理网络请求，并在代理类中打印这些日志信息。

新建网络请求接口：

```Java
Public interface IHttp {
    Void request (String sendData);

    void onSuccess(String receivedData);
}
```

新建 Http 请求工具类：

```Java
Public class HttpUtil implements IHttp {
    @Override
    Public void request (String sendData) {
        System.Out.Println ("网络请求中...");
    }

    @Override
    public void onSuccess(String receivedData) {
        System.out.println("网络请求完成。");
    }
}
```

新建 Http 代理类：

```Java
Public class HttpProxy implements IHttp {
    Private final HttpUtil httpUtil;

    public HttpProxy(HttpUtil httpUtil) {
        this.httpUtil = httpUtil;
    }

    @Override
    public void request(String sendData) {
        httpUtil.request(sendData);
    }

    @Override
    public void onSuccess(String receivedData) {
        httpUtil.onSuccess(receivedData);
    }
}
```

到这里，和我们上述吃饭睡觉的代码是一模一样的，现在我们在 HttpProxy 中新增打印日志信息：

```Java
Public class HttpProxy implements IHttp {
    Private final HttpUtil httpUtil;

    public HttpProxy(HttpUtil httpUtil) {
        this.httpUtil = httpUtil;
    }

    @Override
    public void request(String sendData) {
        System.out.println("发送数据:" + sendData);
        httpUtil.request(sendData);
    }

    @Override
    public void onSuccess(String receivedData) {
        System.out.println("收到数据:" + receivedData);
        httpUtil.onSuccess(receivedData);
    }
}
```

客户端验证：

```Java
Public class Client {
    @Test
    Public void test () {
        HttpUtil httpUtil = new HttpUtil ();
        HttpProxy proxy = new HttpProxy (httpUtil);
        Proxy.Request ("request data");
        Proxy.OnSuccess ("received result");
    }
}
```

运行程序，输出如下：


```
发送数据: request data
网络请求中...
收到数据: received result
网络请求完成。
```

这就是代理模式的一个应用，除了打印日志，它还可以用来做权限管理。读者看到这里可能已经发现了，这个代理类看起来和装饰模式的 FilterInputStream 一模一样，但两者的目的不同，装饰模式是为了增强功能或添加功能，代理模式主要是为了加以控制。

### 动态代理
上例中的代理被称之为静态代理，动态代理与静态代理的原理一模一样，只是换了一种写法。使用动态代理，需要把一个类传入，然后根据它正在调用的方法名判断是否需要加以控制。用伪代码表示如下：

```Java
Public class HttpProxy {
    Private final HttpUtil httpUtil;

    public HttpProxy(HttpUtil httpUtil) {
        this.httpUtil = httpUtil;
    }

    // 假设调用 httpUtil 的任意方法时，都要通过这个方法间接调用, methodName 表示方法名，args 表示方法中传入的参数
    public visit(String methodName, Object[] args) {
        if (methodName.equals("request")) {
            // 如果方法名是 request，打印日志，并调用 request 方法，args 的第一个值就是传入的参数
            System.out.println("发送数据:" + args[0]);
            httpUtil.request(args[0].toString());
        } else if (methodName.equals("onSuccess")) {
            // 如果方法名是 onSuccess，打印日志，并调用 onSuccess 方法，args 的第一个值就是传入的参数
            System.out.println("收到数据:" + args[0]);
            httpUtil.onSuccess(args[0].toString());
        }
    }
}
```

伪代码看起来还是很简单的，实现起来唯一的难点就是怎么让 httpUtil 调用任意方法时，都通过一个方法间接调用。这里需要用到反射技术，不了解反射技术也没有关系，不妨把它记做固定的写法。实际的动态代理类代码如下：

```Java
Public class HttpProxy implements InvocationHandler {
    Private HttpUtil httpUtil;

    public IHttp getInstance(HttpUtil httpUtil) {
        this.httpUtil = httpUtil;
        return (IHttp) Proxy.newProxyInstance(httpUtil.getClass().getClassLoader(), httpUtil.getClass().getInterfaces(), this);
    }

    // 调用 httpUtil 的任意方法时，都要通过这个方法调用
    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        Object result = null;
        if (method.getName().equals("request")) {
            // 如果方法名是 request，打印日志，并调用 request 方法
            System.out.println("发送数据:" + args[0]);
            result = method.invoke(httpUtil, args);
        } else if (method.getName().equals("onSuccess")) {
            // 如果方法名是 onSuccess，打印日志，并调用 onSuccess 方法
            System.out.println("收到数据:" + args[0]);
            result = method.invoke(httpUtil, args);
        }
        return result;
    }
}
```

先看 getInstance 方法，Proxy. NewProxyInstance 方法是 Java 系统提供的方法，专门用于动态代理。其中传入的第一个参数是被代理的类的 ClassLoader，第二个参数是被代理类的 Interfaces，这两个参数都是 Object 中的，每个类都有，这里就是固定写法。我们只要知道系统需要这两个参数才能让我们实现我们的目的：调用被代理类的任意方法时，都通过一个方法间接调用。现在我们给系统提供了这两个参数，系统就会在第三个参数中帮我们实现这个目的。

第三个参数是 InvocationHandler 接口，这个接口中只有一个方法：

```Java
Public Object invoke (Object proxy, Method method, Object[] args) throws Throwable;
```

那么不用猜就知道，现在我们调用被代理类 httpUtil 的任意方法时，都会通过这个 invoke 方法调用了。Invoke 方法中，第一个参数我们暂时用不上，第二个参数 method 就是调用的方法，使用 method.GetName () 可以获取到方法名，第三个参数是调用 method 方法需要传入的参数。本例中无论 request 还是 onSuccess 都只有一个 String 类型的参数，对应到这里就是 `args[0]`。返回的 Object 是 method 方法的返回值，本例中都是无返回值的。

我们在 invoke 方法中判断了当前调用方法的方法名，如果现在调用的方法是 request，那么打印请求参数，并使用这一行代码继续执行当前方法：

```Java
Result = method.Invoke (httpUtil, args);
```

这就是反射调用函数的写法，如果不了解可以记做固定写法，想要了解的同学可以看之前的这篇文章：[详解 Java 反射]([详解 Java 反射_反射是java中独有的吗-CSDN博客](https://blog.csdn.net/AlpinistWang/article/details/102852801))。虽然这个函数没有返回值，但我们还是将 result 返回，这是标准做法。

如果现在调用的方法是 onSuccess，那么打印接收到的数据，并反射继续执行当前方法。

修改客户端验证一下：

```Java
Public class Client {
    @Test
    Public void test () {
        HttpUtil httpUtil = new HttpUtil ();
        IHttp proxy = new HttpProxy (). GetInstance (httpUtil);
        Proxy.Request ("request data");
        Proxy.OnSuccess ("received result");
    }
}
```

运行程序，输出与之前一样：


```
发送数据: request data
网络请求中...
收到数据: received result
网络请求完成。
```

动态代理本质上与静态代理没有区别，它的好处是节省代码量。比如被代理类有 20 个方法，而我们只需要控制其中的两个方法，就可以用动态代理通过方法名对被代理类进行动态的控制，而如果用静态方法，我们就需要将另外的 18 个方法也写出来，非常繁琐。这就是动态代理的优势所在。