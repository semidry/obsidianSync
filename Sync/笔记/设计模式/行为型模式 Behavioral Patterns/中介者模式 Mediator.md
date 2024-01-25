顾名思义，中介这个名字对我们来说实在太熟悉了。平时走在上班路上就会经常见到各种房产中介，他们的工作就是使得买家与卖家不需要直接打交道，只需要分别与中介打交道，就可以完成交易，用计算机术语来说就是减少了耦合度。

当类与类之间的关系呈现网状时，引入一个中介者，可以使类与类之间的关系变成星形。将每个类与多个类的耦合关系简化为每个类与中介者的耦合关系。

举个例子，在我们打麻将时，每两个人之间都可能存在输赢关系。如果每笔交易都由输家直接发给赢家，就会出现一种网状耦合关系。

![[Pasted image 20240107143449.png]]

我们用程序来模拟一下这个过程。

玩家类：

```Java
class Player {
    // 初始资金 100 元
    public int money = 100;

    public void win(Player player, int money) {
        // 输钱的人扣减相应的钱
        player.money -= money;
        // 自己的余额增加
        this.money += money;
    }
}
```
此类中有一个 money 变量，表示自己的余额。当自己赢了某位玩家的钱时，调用 win 方法修改输钱的人和自己的余额。

需要注意的是，我们不需要输钱的方法，因为在 win 方法中，已经将输钱的人对应余额扣除了。

客户端代码：

```Java
public class Client {
    @Test
    public void test() {
        Player player1 = new Player();
        Player player2 = new Player();
        Player player3 = new Player();
        Player player4 = new Player();
        // player1 赢了 player3 5 元
        player1.win(player3, 5);
        // player2 赢了 player1 10 元
        player2.win(player1, 10);
        // player2 赢了 player4 10 元
        player2.win(player4, 10);
        // player4 赢了 player3 7 元
        player4.win(player3, 7);

        // 输出：四人剩余的钱：105,120,88,97
        System.out.println("四人剩余的钱：" + player1.money + "," + player2.money + "," + player3.money + "," + player4.money);
    }
}
```
在客户端中，每两位玩家需要进行交易时，都会增加程序耦合度，相当于每位玩家都需要和其他所有玩家打交道，这是一种不好的做法。

此时，我们可以引入一个中介类 —— 微信群，只要输家将自己输的钱发到微信群里，赢家从微信群中领取对应金额即可。网状的耦合结构就变成了星形结构：

![[Pasted image 20240107143849.png]]

此时，微信群就充当了一个中介者的角色，由它来负责与所有人进行交易，每个玩家只需要与微信群打交道即可。

微信群类：

```Java
class Group {
    public int money;
}
```
此类中只有一个 money 变量表示群内的余额。

玩家类修改如下：

```Java
class Player {
    public int money = 100;
    public Group group;

    public Player(Group group) {
        this.group = group;
    }

    public void change(int money) {
        // 输了钱将钱发到群里 或 在群里领取自己赢的钱
        group.money += money;
        // 自己的余额改变
        this.money += money;
    }
}
```
玩家类中新增了一个构造方法，在构造方法中将中介者传进来。每当自己有输赢时，只需要将钱发到群里或者在群里领取自己赢的钱，然后修改自己的余额即可。

客户端代码对应修改如下：

```Java
public class Client {
    @Test
    public void test(){
        Group group = new Group();
        Player player1 = new Player(group);
        Player player2 = new Player(group);
        Player player3 = new Player(group);
        Player player4 = new Player(group);
        // player1 赢了 5 元
        player1.change(5);
        // player2 赢了 20 元
        player2.change(20);
        // player3 输了 12 元
        player3.change(-12);
        // player4 输了 3 元
        player4.change(-3);

        // 输出：四人剩余的钱：105,120,88,97
        System.out.println("四人剩余的钱：" + player1.money + "," + player2.money + "," + player3.money + "," + player4.money);
    }
}
```
可以看到，通过引入中介者，客户端的代码变得更加清晰了。大家不需要再互相打交道，所有交易通过中介者完成即可。

事实上，这段代码还存在一点不足。因为我们忽略了一个前提：微信群里的钱不可以为负数。也就是说，输家必须先将钱发到微信群内，赢家才能去微信群里领钱。这个功能可以用我们在 [Java 多线程王国奇遇记]([Java 多线程王国奇遇记_java多线程王国奇遇记-CSDN博客](https://blog.csdn.net/AlpinistWang/article/details/106043544)) 中学到的` wait/notify` 机制完成，与中介者模式无关，故这里不再给出相关代码，感兴趣的读者可以自行实现。

总而言之，中介者模式就是用于将类与类之间的多对多关系简化成多对一、一对多关系的设计模式，它的定义如下：

> 中介者模式（Mediator Pattern）：定义一个中介对象来封装一系列对象之间的交互，使原有对象之间的耦合松散，且可以独立地改变它们之间的交互。

中介者模式的缺点也很明显：由于它将所有的职责都移到了中介者类中，也就是说中介类需要处理所有类之间的协调工作，这可能会使中介者演变成一个超级类。所以使用中介者模式时需要权衡利弊。