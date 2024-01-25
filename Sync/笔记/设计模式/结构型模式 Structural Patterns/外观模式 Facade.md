外观模式非常简单，体现的就是 Java 中封装的思想。将多个子系统封装起来，提供一个更简洁的接口供外部调用。

![[Pasted image 20240105142152.png]]

> 外观模式：外部与一个子系统的通信必须通过一个统一的外观对象进行，为子系统中的一组接口提供一个一致的界面，外观模式定义了一个高层接口，这个接口使得这一子系统更加容易使用。外观模式又称为门面模式。

举个例子，比如我们每天打开电脑时，都需要做三件事：

- 打开浏览器
- 打开 IDE
- 打开微信
每天下班时，关机前需要做三件事：

- 关闭浏览器
- 关闭 IDE
- 关闭微信
用程序模拟如下：

新建浏览器类：

```Java
Public class Browser {
    Public static void open () {
        System.Out.Println ("打开浏览器");
    }

    public static void close() {
        System.out.println("关闭浏览器");
    }
}
```

新建 IDE 类：

```Java
Public class IDE {
    Public static void open () {
        System.Out.Println ("打开 IDE");
    }

    public static void close() {
        System.out.println("关闭 IDE");
    }
}
```

新建微信类：

```Java
Public class Wechat {
    Public static void open () {
        System.Out.Println ("打开微信");
    }

    public static void close() {
        System.out.println("关闭微信");
    }
}
```

客户端调用：

```Java
Public class Client {
    @Test
    Public void test () {
        System.Out.Println ("上班: ");
        Browser.Open ();
        IDE.Open ();
        Wechat.Open ();

        System.out.println("下班:");
        Browser.close();
        IDE.close();
        Wechat.close();
    }
}
```

运行程序，输出如下：


```
上班:
打开浏览器
打开 IDE
打开微信
下班:
关闭浏览器
关闭 IDE
关闭微信
```

由于我们每天都要做这几件事，所以我们可以使用外观模式，将这几个子系统封装起来，提供更简洁的接口：

```Java
Public class Facade {
    Public void open () {
        Browser.Open ();
        IDE.Open ();
        Wechat.Open ();
    }

    public void close() {
        Browser.close();
        IDE.close();
        Wechat.close();
    }
}
```

客户端就可以简化代码，只和这个外观类打交道：

```Java
Public class Client {
    @Test
    Public void test () {
        Facade facade = new Facade ();
        System.Out.Println ("上班: ");
        Facade.Open ();

        System.out.println("下班:");
        facade.close();
    }
}
```

运行程序，输出与之前一样。

外观模式就是这么简单，它使得两种不同的类不用直接交互，而是通过一个中间件——也就是外观类——间接交互。外观类中只需要暴露简洁的接口，隐藏内部的细节，所以说白了就是封装的思想。

外观模式非常常用，（当然了！写代码哪有不封装的！）尤其是在第三方库的设计中，我们应该提供尽量简洁的接口供别人调用。另外，在 MVC 架构中，C 层（Controller）就可以看作是外观类，Model 和 View 层通过 Controller 交互，减少了耦合。