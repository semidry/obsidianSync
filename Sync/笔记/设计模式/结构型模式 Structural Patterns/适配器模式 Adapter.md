---
dg-publish: true
---
说到适配器，我们最熟悉的莫过于电源适配器了，也就是手机的充电头。它就是适配器模式的一个应用。

试想一下，你有一条连接电脑和手机的 USB 数据线，连接电脑的一端从电脑接口处接收 5 V 的电压，连接手机的一端向手机输出 5 V 的电压，并且他们工作良好。

中国的家用电压都是 220 V，所以 USB 数据线不能直接拿来给手机充电，这时候我们有两种方案：

- 单独制作手机充电器，接收 220 V 家用电压，输出 5 V 电压。
- 添加一个适配器，将 220 V 家庭电压转化为类似电脑接口的 5 V 电压，再连接数据线给手机充电。
如果你使用过早期的手机，就会知道以前的手机厂商采用的就是第一种方案：早期的手机充电器都是单独制作的，充电头和充电线是连在一起的。现在的手机都采用了电源适配器加数据线的方案。这是生活中应用适配器模式的一个进步。
![[Pasted image 20240104111113.png]]
> 适配器模式：将一个类的接口转换成客户希望的另外一个接口，使得原本由于接口不兼容而不能一起工作的那些类能一起工作。

适配的意思是适应、匹配。通俗地讲，适配器模式适用于有相关性但不兼容的结构，源接口通过一个中间件转换后才可以适用于目标接口，这个转换过程就是适配，这个中间件就称之为适配器。

家用电源和 USB 数据线有相关性：家用电源输出电压，USB 数据线输入电压。但两个接口无法兼容，因为一个输出 220 V，一个输入 5 V，通过适配器将输出 220 V 转换成输出 5 V 之后才可以一起工作。

让我们用程序来模拟一下这个过程。

首先，家庭电源提供 220 V 的电压：

```Java
Class HomeBattery {
    Int supply () {
        // 家用电源提供一个 220 V 的输出电压
        Return 220;
    }
}
```
USB 数据线只接收 5 V 的充电电压：

```Java
Class USBLine {
    Void charge (int volt) {
        // 如果电压不是 5 V，抛出异常
        If (volt != 5) throw new IllegalArgumentException ("只能接收 5 V 电压");
        // 如果电压是 5 V，正常充电
        System.Out.Println ("正常充电");
    }
}
```
先来看看适配之前，用户如果直接用家庭电源给手机充电：

```Java
Public class User {
    @Test
    Public void chargeForPhone () {
        HomeBattery homeBattery = new HomeBattery ();
        Int homeVolt = homeBattery.Supply ();
        System.Out.Println ("家庭电源提供的电压是 " + homeVolt + "V");

        USBLine usbLine = new USBLine();
        usbLine.charge(homeVolt);
    }
}
```
运行程序，输出如下：

```Java
家庭电源提供的电压是 220 V
Java. Lang. IllegalArgumentException: 只能接收 5 V 电压
```
这时，我们加入电源适配器：

```Java
Class Adapter {
    Int convert (int homeVolt) {
        // 适配过程：使用电阻、电容等器件将其降低为输出 5 V
        Int chargeVolt = homeVolt - 215;
        Return chargeVolt;
    }
}
```
然后，用户再使用适配器将家庭电源提供的电压转换为充电电压：

```Java
Public class User {
    @Test
    Public void chargeForPhone () {
        HomeBattery homeBattery = new HomeBattery ();
        Int homeVolt = homeBattery.Supply ();
        System.Out.Println ("家庭电源提供的电压是 " + homeVolt + "V");

        Adapter adapter = new Adapter();
        int chargeVolt = adapter.convert(homeVolt);
        System.out.println("使用适配器将家庭电压转换成了 " + chargeVolt + "V");

        USBLine usbLine = new USBLine();
        usbLine.charge(chargeVolt);
    }
}
```
运行程序，输出如下：

```Java
家庭电源提供的电压是 220 V
使用适配器将家庭电压转换成了 5 V
正常充电
```
这就是适配器模式。在我们日常的开发中经常会使用到各种各样的 Adapter，都属于适配器模式的应用。

但适配器模式并不推荐多用。因为未雨绸缪好过亡羊补牢，如果事先能预防接口不同的问题，不匹配问题就不会发生，只有遇到源接口无法改变时，才应该考虑使用适配器。比如现代的电源插口中很多已经增加了专门的 USB 充电接口，让我们不需要再使用适配器转换接口，这又是社会的一个进步。

补充：

收到不少读者的反馈，认为文中的这个例子举得过于简单。但实际上这个例子已经反映出了适配器模式的基本概念了。适配器模式的作用类似下图：
![[Pasted image 20240104111151.png]]
![[Pasted image 20240104111135.png]]
![[Pasted image 20240104111200.png]]
在本例中，适配前的 A 表示 220 V，适配后的 B 表示 5 V，C 就是适配过程，本例中的适配过程是使用电阻、电容等器件将其降低为输出 5 V。适配器的核心思想就是使用适配器包装适配过程，这个适配器通常被命名为 Adapter 或者 Wrapper。

只不过通常我们见到的适配器模式是基于接口的适配。那么我们不妨看一个接口适配的例子。

设想我们已经有了一个 Task 类，实现了 Callable 接口：

```Java
public class Task implements Callable<Integer> {

    @Override
    Public Integer call () throws Exception {
        System.Out.Println ("I'm called.");
        Return null;
    }
}
```
这时我们需要这个 Task 类在一个子线程中执行：

```Java
Public class Client {
    @Test
    Public void call () throws InterruptedException {
        Callable<Integer> callable = new Task ();
        // 这一行无法编译通过
        Thread thread = new Thread (callable);
        Thread.Start ();
        // 等待 1 s 保证 thread 执行完成
        Thread.Sleep (1000);
    }
}
```
但我们会发现，Thread thread = new Thread (callable); 这一行是无法编译通过的，因为 Thread 中需要接收的参数类型是 Runnable。

在业务上来说，Runnable 的 run 方法和 Callable 的 call 方法意义是一样的，这里的问题是接口不一致。所以我们可以通过接口适配器将接口转换成一致的。

```Java

Public class RunnableAdapter implements Runnable {

    private final Callable<?> callable;

    public RunnableAdapter (Callable<?> callable) {
        This. Callable = callable;
    }

    @Override
    Public void run () {
        Try {
            Callable.Call ();
        } catch (Exception e) {
            e.printStackTrace ();
        }
    }
}
```
可以看到，在 RunnableAdapter 中，我们包装了原始的 Callable 接口，并实现了新的 Runnable 接口。在 Runnable 接口的 run 方法中，调用 Callable 接口的 call 方法。实现同样的业务功能。

在客户端中使用 RunnableAdapter 类：

```Java
Public class Client {
    @Test
    Public void call () throws InterruptedException {
        Callable<Integer> callable = new Task ();
        Thread thread = new Thread (new RunnableAdapter (callable));
        Thread.Start ();
        // 等待 1 s 保证 thread 执行完成
        Thread.Sleep (1000);
    }
}
```
运行程序，输出如下：
```
I'm called.
```
可以看到，通过添加适配器，使得原本不兼容的两个接口能够正常工作了。适配器在其中的职责是包装了原有的接口，这样的适配器称为接口适配器。类似地，包装一个对象的适配器被称之为对象适配器。

适配器模式的核心思想是添加一个中间件，包装原有的接口或对象，将其转换为另一个接口或对象，以适应新的业务场景。适配器模式和后文介绍的装饰者模式、代理模式同属于包装模式。与其他两种包装模式不同的是，适配器模式重在转换，不改变原有的功能。而装饰者模式会在包装的基础上增强或添加功能，代理模式用于加强对原有类的控制。