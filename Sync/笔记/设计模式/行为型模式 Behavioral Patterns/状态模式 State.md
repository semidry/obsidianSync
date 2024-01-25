---
dg-publish: true
---
> 状态模式（State Pattern）：当一个对象的内在状态改变时允许改变其行为，这个对象看起来像是改变了其类。

通俗地说，状态模式就是一个关于多态的设计模式。

如果一个对象有多种状态，并且每种状态下的行为不同，一般的做法是在这个对象的各个行为中添加 if-else 或者 switch-case 语句。但更好的做法是为每种状态创建一个状态对象，使用状态对象替换掉这些条件判断语句，使得状态控制更加灵活，扩展性也更好。

举个例子，力扣的用户有两种状态：普通用户和 PLUS 会员。PLUS 会员有非常多的专享功能，其中“模拟面试”功能非常有特色，我们便以此为例。

- 当普通用户点击模拟面试功能时，提示用户：模拟面试是 Plus 会员专享功能；
- 当 PLUS 会员点击模拟面试功能时，开始一场模拟面试。

先来看看不使用状态模式的写法，看出它的缺点后，我们再用状态模式来重构代码。

首先定义一个用户状态枚举类：

```Java
Public enum State {
    NORMAL, PLUS
}
```
NORMAL 代表普通用户状态，PLUS 代表 PLUS 会员状态。

用户的功能接口：

```Java
Public interface IUser {
    Void mockInterview ();
}
本例中我们只定义了一个模拟面试的方法，实际开发中这里可能会有许许多多的方法。

用户状态切换接口：
```

```Java
Public interface ISwitchState {
    Void purchasePlus ();

    void expire();
}
```
此接口中定义了两个方法：purchasePlus 方法表示购买 Plus 会员，用户状态变为 PLUS 会员状态，expire 方法表示会员过期，用户状态变为普通用户状态。

力扣用户类：

```Java
Public class User implements IUser, ISwitchState {
    Private State state = State. NORMAL;

    @Override
    public void mockInterview() {
        if (state == State.PLUS) {
            System.out.println("开始模拟面试");
        } else {
            System.out.println("模拟面试是 Plus 会员专享功能");
        }
    }

    @Override
    public void purchasePlus() {
        state = State.PLUS;
    }

    @Override
    public void expire() {
        state = State.NORMAL;
    }
}
```
用户类实现了 IUser 接口，IUser 接口中的每个功能都需要判断用户是否为 Plus 会员，也就是说每个方法中都有 if (state == State. PLUS) {} else {}语句，如果状态不止两种，还需要用上 switch-case 语句来判断状态，这就是不使用状态模式的弊端：

- 判断用户状态会产生大量的分支判断语句，导致代码冗长；
- 当状态有增加或减少时，需要改动多个地方，违反开闭原则。

在《代码整洁之道》、《重构》两本书中都提到：应使用多态取代条件表达式。接下来我们就利用多态特性重构这份代码。

为每个状态新建一个状态类，
普通用户：

```Java
Class Normal implements IUser {

    @Override
    public void mockInterview() {
        System.out.println("模拟面试是 Plus 会员专享功能");
    }
}

```
PLUS 会员：

```Java
Class Plus implements IUser {

    @Override
    public void mockInterview() {
        System.out.println("开始模拟面试");
    }
}
```
每个状态类都实现了 IUser 接口，在接口方法中实现自己特定的行为。

用户类：

```Java
Class User implements IUser, ISwitchState {

    IUser state = new Normal();

    @Override
    public void mockInterview() {
        state.mockInterview();
    }

    @Override
    public void purchasePlus() {
        state = new Plus();
    }

    @Override
    public void expire() {
        state = new Normal();
    }
}
```
可以看到，丑陋的状态判断语句消失了，无论 IUser 接口中有多少方法，User 类都只需要调用状态类的对应方法即可。

客户端测试：

```Java
Public class Client {

    @Test
    public void test() {
        // 用户初始状态为普通用户
        User user = new User();
        // 输出：模拟面试是 Plus 会员专享功能
        user.mockInterview();

        // 用户购买 Plus 会员，状态改变
        user.purchasePlus();
        // 输出：开始模拟面试
        user.mockInterview();

        // Plus 会员过期，变成普通用户，状态改变
        user.expire();
        // 输出：模拟面试是 Plus 会员专享功能
        user.mockInterview();
    }
}
```
可以看到，用户状态改变后，行为也随着改变了，这就是状态模式定义的由来，它的优点是：将与特定状态相关的行为封装到一个状态对象中，使用多态代替 if-else 或者 switch-case 状态判断。缺点是必然导致类增加，这也是使用多态不可避免的缺点。