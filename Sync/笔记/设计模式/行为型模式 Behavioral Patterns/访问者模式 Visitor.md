许多设计模式的书中都说访问者模式是最复杂的设计模式，实际上只要我们对它抽丝剥茧，就会发现访问者模式的核心思想并不复杂。

以我们去吃自助餐为例，每个人喜欢的食物是不一样的，比如 Aurora 喜欢吃龙虾和西瓜，Kevin 喜欢吃牛排和香蕉，餐厅不可能单独为某一位顾客专门准备食物。所以餐厅的做法是将所有的食物都准备好，顾客按照需求自由取用。此时，顾客和餐厅之间就形成了一种访问者与被访问者的关系。

准备好各种食物的餐厅：

```Java
Class Restaurant {
    Private String lobster = "lobster";
    Private String watermelon = "watermelon";
    Private String steak = "steak";
    Private String banana = "banana";
}
```
在餐厅类中，我们提供了四种食物：龙虾、西瓜、牛排、香蕉。

为顾客提供的接口：

```Java
Public interface IVisitor {

    void chooseLobster(String lobster);

    void chooseWatermelon(String watermelon);

    void chooseSteak(String steak);

    void chooseBanana(String banana);
}
```
接口中提供了四个方法，让顾客依次选择每种食物。

在餐厅中提供接收访问者的方法：

```Java
Class Restaurant {
    ...

    public void welcome(IVisitor visitor) {
        visitor.chooseLobster(lobster);
        visitor.chooseWatermelon(watermelon);
        visitor.chooseSteak(steak);
        visitor.chooseBanana(banana);
    }
}
```
在 welcome 方法中，我们将食物依次传递给访问者对应的访问方法。这时候，顾客如果想要访问餐厅选择自己喜欢的食物，只需要实现 IVisitor 接口即可。

比如顾客 Aurora 类：

```Java
Public class Aurora implements IVisitor {
    @Override
    Public void chooseLobster (String lobster) {
        System.Out.Println ("Aurora gets a " + lobster);
    }

    @Override
    public void chooseWatermelon(String watermelon) {
        System.out.println("Aurora gets a " + watermelon);
    }

    @Override
    public void chooseSteak(String steak) {
        System.out.println("Aurora doesn't like " + steak);
    }

    @Override
    public void chooseBanana(String banana) {
        System.out.println("Aurora doesn't like " + banana);
    }
}
```
在此类中，顾客根据自己的喜好依次选择每种食物。

客户端测试：

```Java
Public class Client {
    @Test
    Public void test () {
        Restaurant restaurant = new Restaurant ();
        IVisitor Aurora = new Aurora ();
        Restaurant.Welcome (Aurora);
    }
}
```
运行程序，输出如下：


```
Aurora gets a lobster
Aurora gets a watermelon
Aurora doesn't like steak
Aurora doesn't like banana
```
可以看到，Aurora 对每一种食物做出了自己的选择，这就是一个最简单的访问者模式，它已经体现出了访问者模式的核心思想：将数据的结构和对数据的操作分离。

> 访问者模式（Visitor Pattern）：表示一个作用于某对象结构中的各元素的操作。它使你可以在不改变各元素的类的前提下定义作用于这些元素的新操作。

本例中，顾客需要选择餐厅的食物，由于每个顾客对食物的选择是不一样的，如果在餐厅类中处理每位顾客的需求，必然导致餐厅类职责过多。所以我们并没有在餐厅类中处理顾客的需求，而是将所有的食物通过接口暴露出去，欢迎每位顾客来访问。顾客只要实现访问者接口就能访问到所有的食物，然后在接口方法中做出自己的选择。

相信这个例子还是非常简单直观的，看起来访问者模式也不是那么难理解。那么为什么很多书中说访问者模式是最复杂的设计模式呢？原因就在于《设计模式》一书中给访问者模式设计了一个“双重分派”的机制，而 Java 只支持单分派，用单分派语言强行模拟出双重分派才导致了访问者模式看起来比较复杂。要理解这一点，我们先来了解一下何谓单分派、何谓双重分派。

### 单分派与双重分派
先看一段代码：

Food 类：

```Java
Public class Food {
    Public String name () {
        Return "food";
    }
}
```
Watermelon 类，继承自 Food 类：

```Java
Public class Watermelon extends Food {
    @Override
    Public String name () {
        Return "watermelon";
    }
}
```
在 Watermelon 类中，我们重写了 name () 方法。

客户端：

```Java
Public class Client {
    @Test
    Public void test () {
        Food food = new Watermelon ();
        System.Out.Println (food.Name ());
    }
}
```
思考一下，在客户端中，我们 new 出了一个 Watermelon 对象，但他的声明类型是 Food，当我们调用此对象的 name 方法时，会输出 "food" 还是 "watermelon" 呢？

了解过 Java 多态特性的同学都知道，这里肯定是输出 "watermelon" ，因为 Java 调用重写方法时，会根据运行时的具体类型来确定调用哪个方法。

再来看一段测试代码：

```Java
Public class Client {
    @Test
    Public void test () {
        Food food = new Watermelon ();
        Eat (food);
    }

    public void eat(Food food) {
        System.out.println("eat food");
    }

    public void eat(Watermelon watermelon) {
        System.out.println("eat watermelon");
    }
}
```
在这段代码中，我们仍然 new 出了一个 Watermelon 对象，他的声明类型是 Food，在客户端中有 eat (Food food) 和 eat (Watermelon watermelon) 两个重载方法，这段代码会调用哪一个方法呢？

我们运行这段代码会发现输出的是：


```
Eat food
```
这是由于 Java 在调用重载方法时，只会根据方法签名中声明的参数类型来判断调用哪个方法，不会去判断参数运行时的具体类型是什么。

从这两个例子中，我们可以看出 Java 对重写方法和重载方法的调用方式是不同的。

- 调用重写方法时，与对象的运行时类型有关；
- 调用重载方法时，只与方法签名中声明的参数类型有关，与对象运行时的具体类型无关。

了解了重写方法和重载方法调用方式的区别之后，我们将其综合起来就能理解何谓双重分派了。

测试代码：

```Java
Public class Client {
    @Test
    Public void test () {
        Food food = new Watermelon ();
        Eat (food);
    }

    public void eat(Food food) {
        System.out.println("eat food: " + food.name());
    }

    public void eat(Watermelon watermelon) {
        System.out.println("eat watermelon" + watermelon.name());
    }
}
```
在这段测试代码中，仍然是 new 出了一个 Watermelon 对象，它的声明类型为 Food。运行 test () 函数，输出如下：


```
Eat food: watermelon
```
在面向对象的编程语言中，我们将方法调用称之为分派，这段测试代码运行时，经过了两次分派：

- 调用重载方法：选择调用 eat (Food food) 还是 eat (Watermelon watermelon) 。虽然这里传入的这个参数实际类型是 Watermelon，但这里会调用 eat (Food food) ，这是由于调用哪个重载方法是在编译期就确定了的，也称之为静态分派。
- 调用重写方法：选择调用 Food 的 name 方法还是 Watermelon 的 name 方法。这里会根据参数运行时的实际类型，调用 Watermelon 的 name 方法，称之为动态分派。

单分派、双重分派的定义如下：

> 方法的接收者和方法的参数统称为方法的宗量。根据分派基于多少个宗量，可以将分派分为单分派和多分派。单分派是指根据一个宗量就可以知道应该调用哪个方法，多分派是指需要根据多个宗量才能确定调用目标。

这段定义可能不太好理解，通俗地讲，单分派和双重分派的区别就是：程序在选择重载方法和重写方法时，如果两种情况都是动态分派的，则称之为双重分派；如果其中一种情况是动态分派，另一种是静态分派，则称之为单分派。

说了这么多，这和我们的访问者模式有什么关系呢？首先我们要知道，架构的演进往往都是由复杂的业务驱动的，当程序需要更好的扩展性，更灵活的架构便诞生出来。

上例中的程序非常简单，但它无法处理某种食物有多个的情形。接下来我们就来修改一下程序，来应对每种食物有多个的场景。

### 自助餐程序 2.0 版
在上面的例子中，为了突出访问者模式的特点，我们将每种食物都简化为了 String 类型，实际开发中，每种食物都应该是一个单独的对象，统一继承自父类 Food：

```Java
Public abstract class Food {
    Public abstract String name ();
}
```
继承自 Food 的四种食物：


龙虾
```Java
Public class Lobster extends Food {
    @Override
    Public String name () {
        Return "lobster";
    }
}
```

西瓜
```Java
Public class Watermelon extends Food {
    @Override
    Public String name () {
        Return "watermelon";
    }
}
```

牛排
```Java
Public class Steak extends Food {
    @Override
    Public String name () {
        Return "steak";
    }
}
```

香蕉
```Java
Public class Banana extends Food {
    @Override
    Public String name () {
        Return "banana";
    }
}
```
四个子类中分别重写了 name 方法，返回自己的食物名。

IVisitor 接口对应修改为：

```Java
Public interface IVisitor {
    Void chooseFood (Lobster lobster);

    void chooseFood(Watermelon watermelon);

    void chooseFood(Steak steak);

    void chooseFood(Banana banana);
}
```
每种食物都继承自 Food，所以我们将接口中的方法名都修改为了 chooseFood。

餐厅类修改如下：

```Java
Class Restaurant {

    // 准备当天的食物
    private List<Food> prepareFoods() {
        List<Food> foods = new ArrayList<>();
        // 简单模拟，每种食物添加 10 份
        for (int i = 0; i < 10; i++) {
            foods.add(new Lobster());
            foods.add(new Watermelon());
            foods.add(new Steak());
            foods.add(new Banana());
        }
        return foods;
    }

    // 欢迎顾客来访
    public void welcome(IVisitor visitor) {
        // 获取当天的食物
        List<Food> foods = prepareFoods();
        // 将食物依次提供给顾客选择
        for (Food food : foods) {
            // 由于单分派机制，此处无法编译通过
            visitor.chooseFood(food);
        }
    }
}
```
餐厅类中新增了 prepareFoods 方法，在这个方法中，我们简单模拟了准备多个食物的过程，将每种食物添加了 10 份。在接收访问者的 welcome 方法中，遍历所有食物，分别提供给顾客。

看起来很美好，实际上，visitor.ChooseFood (food) 这一行是无法编译通过的，原因就在于上一节中提到的单分派机制。虽然每种食物都继承自 Food 类，但由于接口中没有 chooseFood (Food food) 这个重载方法，所以这一行会报错 <font color=red>"Cannot resolve method chooseFood"</font>。

试想，如果 Java 在调用重载方法时也采用动态分派，也就是根据参数的运行时类型选择对应的重载方法，这里遇到的问题就迎刃而解了，我们的访问者模式讲到这里也就可以结束了。

但由于 Java 是单分派语言，所以我们不得不想办法解决这个 bug，目的就是使用单分派的 Java 语言模拟出双分派的效果，能够根据运行时的具体类型调用对应的重载方法。

我们很容易想到一种解决方式，采用 instanceOf 判断对象的具体子类型，再将父类强制转换为具体子类型，调用对应的接口方法：

```Java
// 通过 instanceOf 判断具体子类型，再强制向下转型
If (food instanceof Lobster) visitor.ChooseFood ((Lobster) food);
Else if (food instanceof Watermelon) visitor.ChooseFood ((Watermelon) food);
Else if (food instanceof Steak) visitor.ChooseFood ((Steak) food);
Else if (food instanceof Banana) visitor.ChooseFood ((Banana) food);
Else throw new IllegalArgumentException ("Unsupported type of food.");
```
的确可行，在某些开源代码中便是这么做的，但这种强制转型的方式既冗长又不符合开闭原则，所以《设计模式》一书中给我们推荐了另一种做法。

首先在 Food 类中添加 accept (Visitor visitor) 抽象方法：

```Java
Public abstract class Food {
    Public abstract String name ();

    // Food 中添加 accept 方法，接收访问者
    public abstract void accept(IVisitor visitor);
}
```
在具体子类中，实现此方法：

```Java
Public class Lobster extends Food {
    @Override
    Public String name () {
        Return "lobster";
    }

    @Override
    public void accept(IVisitor visitor) {
        visitor.chooseFood(this);
    }
}
```
经过这两步修改，餐厅类就可以将接收访问者的方法修改如下：

```Java
Class Restaurant {

    // 准备当天的食物
    private List<Food> prepareFoods() {
        List<Food> foods = new ArrayList<>();
        // 简单模拟，每种食物添加 10 份
        for (int i = 0; i < 10; i++) {
            foods.add(new Lobster());
            foods.add(new Watermelon());
            foods.add(new Steak());
            foods.add(new Banana());
        }
        return foods;
    }

    // 欢迎顾客来访
    public void welcome(IVisitor visitor) {
        // 获取当天的食物
        List<Food> foods = prepareFoods();
        // 将食物依次提供给顾客选择
        for (Food food : foods) {
            // 由于重写方法是动态分派的，所以这里会调用具体子类的 accept 方法，
            food.accept(visitor);
        }
    }
}
```
经过这三步修改，我们将访问者来访的代码由：

```Java
Visitor.ChooseFood (food);
```
改成了

```Java
Food.Accept (visitor);
```
这样我们就将重载方法模拟成了动态分派。这里的实现非常巧妙，由于 Java 调用重写方法时是动态分派的，所以 food.Accept (visitor) 会调用具体子类的 accept 方法，在具体子类的 accept 方法中，调用 visitor.ChooseFood (this)，由于这个 accept 方法是属于具体子类的，所以这里的 this 一定是指具体的子类型，不会产生歧义。

再深入分析一下：之前的代码中，调用 visitor.ChooseFood (food) 这行代码时，由于重载方法不知道 Food 的具体子类型导致了编译失败，但实际上这时我们是可以拿到 Food 的具体子类型的。利用重写方法会动态分派的特性，我们在子类的重写方法中去调用这些重载的方法，使得重载方法使用起来也像是动态分派的一样。

顾客 Aurora 类：

```Java
Public class Aurora implements IVisitor {

    @Override
    public void chooseFood(Lobster lobster) {
        System.out.println("Aurora gets a " + lobster.name());
    }

    @Override
    public void chooseFood(Watermelon watermelon) {
        System.out.println("Aurora gets a " + watermelon.name());
    }

    @Override
    public void chooseFood(Steak steak) {
        System.out.println("Aurora doesn't like " + steak.name());
    }

    @Override
    public void chooseFood(Banana banana) {
        System.out.println("Aurora doesn't like " + banana.name());
    }
}
```
顾客 Kevin 类：

```Java
Public class Kevin implements IVisitor {

    @Override
    public void chooseFood(Lobster lobster) {
        System.out.println("Kevin doesn't like " + lobster.name());
    }

    @Override
    public void chooseFood(Watermelon watermelon) {
        System.out.println("Kevin doesn't like " + watermelon.name());
    }

    @Override
    public void chooseFood(Steak steak) {
        System.out.println("Kevin gets a " + steak.name());
    }

    @Override
    public void chooseFood(Banana banana) {
        System.out.println("Kevin gets a " + banana.name());
    }
}
```
客户端测试：

```Java
Public class Client {
    @Test
    Public void test () {
        Restaurant restaurant = new Restaurant ();
        IVisitor Aurora = new Aurora ();
        IVisitor Kevin = new Kevin ();
        Restaurant.Welcome (Aurora);
        Restaurant.Welcome (Kevin);
    }
}
```
运行程序，输出如下：
```
Aurora gets a lobster
Aurora gets a watermelon
Aurora doesn't like steak
Aurora doesn't like banana
... 输出 10 遍
Kevin doesn't like lobster
Kevin doesn't like watermelon
Kevin gets a steak
Kevin gets a banana
... 输出 10 遍
```
这就是访问者模式，它的核心思想其实非常简单，就是第一小节中体现的将数据的结构与对数据的操作分离。之所以说它复杂，主要在于大多数语言都是单分派语言，所以不得不模拟出一个双重分派，也就是用重写方法的动态分派特性将重载方法也模拟成动态分派。

但模拟双重分派只是手段，不是目的。有的文章中说模拟双重分派是访问者模式的核心，还有的文章中说双分派语言不需要访问者模式，笔者认为这些说法都有点舍本逐末了。