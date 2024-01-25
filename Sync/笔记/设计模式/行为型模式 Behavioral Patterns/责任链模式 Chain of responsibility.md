我们每个人在工作中都承担着一定的责任，比如程序员承担着开发新功能、修改 bug 的责任，运营人员承担着宣传的责任、HR 承担着招聘新人的责任。我们每个人的责任与这个责任链有什么关系吗？

——答案是并没有太大关系。 ^a76727

但也不是完全没有关系，主要是因为每个人在不同岗位上的责任是分散的，分散的责任组合在一起更像是一张网，无法组成一条链。

同一个岗位上的责任，就可以组成一条链。

举个切身的例子，比如：普通的程序员可以解决中等难度的 bug，优秀程序员可以解决困难的 bug，而菜鸟程序员只能解决简单的 bug。为了将其量化，我们用一个数字来表示 bug 的难度，(0, 20] 表示简单，(20,50] 表示中等， (50,100] 表示困难，我们来模拟一个 bug 解决的流程。

### “解决 bug” 程序 1.0
新建一个 bug 类：

```Java
public class Bug {
    // bug 的难度值
    int value;

    public Bug(int value) {
        this.value = value;
    }
}
```
新建一个程序员类：

```Java
public class Programmer {
    // 程序员类型：菜鸟、普通、优秀
    public String type;

    public Programmer(String type) {
        this.type = type;
    }

    public void solve(Bug bug) {
        System.out.println(type + "程序员解决了一个难度为 " + bug.value + " 的 bug");
    }
}
```
客户端：

```Java
import org.junit.Test;

public class Client {
    @Test
    public void test() {
        Programmer newbie = new Programmer("菜鸟");
        Programmer normal = new Programmer("普通");
        Programmer good = new Programmer("优秀");

        Bug easy = new Bug(20);
        Bug middle = new Bug(50);
        Bug hard = new Bug(100);

        // 依次尝试解决 bug
        handleBug(newbie, easy);
        handleBug(normal, easy);
        handleBug(good, easy);

        handleBug(newbie, middle);
        handleBug(normal, middle);
        handleBug(good, middle);

        handleBug(newbie, hard);
        handleBug(normal, hard);
        handleBug(good, hard);
    }

    public void handleBug(Programmer programmer, Bug bug) {
        if (programmer.type.equals("菜鸟") && bug.value > 0 && bug.value <= 20) {
            programmer.solve(bug);
        } else if (programmer.type.equals("普通") && bug.value > 20 && bug.value <= 50) {
            programmer.solve(bug);
        } else if (programmer.type.equals("优秀") && bug.value > 50 && bug.value <= 100) {
            programmer.solve(bug);
        }
    }
}
```
代码逻辑很简单，我们让三种类型的程序员依次尝试解决 bug，如果 bug 难度在自己能解决的范围内，则自己处理此 bug。

运行程序，输出如下：

```Java
菜鸟程序员解决了一个难度为 20 的 bug
普通程序员解决了一个难度为 50 的 bug
优秀程序员解决了一个难度为 100 的 bug
```
输出没有问题，说明功能完美实现了，但在这个程序中，我们让每个程序员都尝试处理了每一个 bug，这也就相当于大家围着讨论每个 bug 该由谁解决，这无疑是非常低效的做法。那么我们要怎么才能优化呢？

### “解决 bug” 程序 2.0
实际上，许多公司会选择让项目经理来分派任务，项目经理会根据 bug 的难度指派给不同的人解决。

引入 ProjectManager 类：

```Java
public class ProjectManager {
    Programmer newbie = new Programmer("菜鸟");
    Programmer normal = new Programmer("普通");
    Programmer good = new Programmer("优秀");

    public void assignBug(Bug bug) {
        if (bug.value > 0 && bug.value <= 20) {
            System.out.println("项目经理将这个简单的 bug 分配给了菜鸟程序员");
            newbie.solve(bug);
        } else if (bug.value > 20 && bug.value <= 50) {
            System.out.println("项目经理将这个中等的 bug 分配给了普通程序员");
            normal.solve(bug);
        } else if (bug.value > 50 && bug.value <= 100) {
            System.out.println("项目经理将这个困难的 bug 分配给了优秀程序员");
            good.solve(bug);
        }
    }
}
```
我们让项目经理管理所有的程序员，并且根据 bug 的难度指派任务。这样一来，所有的 bug 只需传给项目经理分配即可，修改客户端如下：

```Java
import org.junit.Test;

public class Client2 {
    @Test
    public void test() {
        ProjectManager manager = new ProjectManager();

        Bug easy = new Bug(20);
        Bug middle = new Bug(50);
        Bug hard = new Bug(100);

        manager.assignBug(easy);
        manager.assignBug(middle);
        manager.assignBug(hard);
    }
}
```
运行程序，输出如下：

```Java
项目经理将这个简单的 bug 分配给了菜鸟程序员
菜鸟程序员解决了一个难度为 20 的 bug
项目经理将这个中等的 bug 分配给了普通程序员
普通程序员解决了一个难度为 50 的 bug
项目经理将这个困难的 bug 分配给了优秀程序员
优秀程序员解决了一个难度为 100 的 bug
```
看起来很美好，除了项目经理在骂骂咧咧地反驳这个方案。

在这个经过修改的程序中，项目经理一个人承担了分配所有 bug 这个体力活。程序没有变得简洁，只是把复杂的逻辑从客户端转移到了项目经理类中。

而且项目经理类承担了过多的职责，如果以后新增一类程序员，必须改动项目经理类，将其处理 bug 的职责插入分支判断语句中，违反了单一职责原则和开闭原则。

所以，我们需要更优的解决方案，那就是——责任链模式！

### “解决 bug” 程序 3.0
> 责任链模式：使多个对象都有机会处理请求，从而避免请求的发送者和接收者之间的耦合关系。将这些对象连成一条链，并沿着这条链传递该请求，直到有一个对象处理它为止。

在本例的场景中，每个程序员的责任都是“解决这个 bug”，当测试提出一个 bug 时，可以走这样一条责任链：

- 先交由菜鸟程序员之手，如果是简单的 bug，菜鸟程序员自己处理掉。如果这个 bug 对于菜鸟程序员来说太难了，交给普通程序员
- 如果是中等难度的 bug，普通程序员处理掉。如果他也解决不了，交给优秀程序员
- 优秀程序员处理掉困难的 bug
有的读者会提出疑问，如果优秀程序员也无法处理这个 bug 呢？

——那当然是处理掉这个假冒优秀程序员。

修改客户端如下：

```Java
import org.junit.Test;

public class Client3 {
    @Test
    public void test() throws Exception {
        Programmer newbie = new Programmer("菜鸟");
        Programmer normal = new Programmer("普通");
        Programmer good = new Programmer("优秀");

        Bug easy = new Bug(20);
        Bug middle = new Bug(50);
        Bug hard = new Bug(100);

        // 链式传递责任
        if (!handleBug(newbie, easy)) {
            if (!handleBug(normal, easy)) {
                if (!handleBug(good, easy)) {
                    throw new Exception("Kill the fake good programmer!");
                }
            }
        }

        if (!handleBug(newbie, middle)) {
            if (!handleBug(normal, middle)) {
                if (!handleBug(good, middle)) {
                    throw new Exception("Kill the fake good programmer!");
                }
            }
        }

        if (!handleBug(newbie, hard)) {
            if (!handleBug(normal, hard)) {
                if (!handleBug(good, hard)) {
                    throw new Exception("Kill the fake good programmer!");
                }
            }
        }
    }

    public boolean handleBug(Programmer programmer, Bug bug) {
        if (programmer.type.equals("菜鸟") && bug.value > 0 && bug.value <= 20) {
            programmer.solve(bug);
            return true;
        } else if (programmer.type.equals("普通") && bug.value > 20 && bug.value <= 50) {
            programmer.solve(bug);
            return true;
        } else if (programmer.type.equals("优秀") && bug.value > 50 && bug.value <= 100) {
            programmer.solve(bug);
            return true;
        }
        return false;
    }
}
```
三个嵌套的 if 条件句就组成了一条 菜鸟-> 普通 -> 优秀 的责任链。我们使 handleBug 方法返回一个 boolean 值，如果此 bug 被处理了，返回 true；否则返回 false，使得责任沿着 菜鸟-> 普通 -> 优秀这条链继续传递，这就是责任链模式的思路。

运行程序，输出如下：

```Java
菜鸟程序员解决了一个难度为 20 的 bug
普通程序员解决了一个难度为 50 的 bug
优秀程序员解决了一个难度为 100 的 bug
```
熟悉责任链模式的同学应该可以看出，这个责任链模式和我们平时使用的不太一样。事实上，这段代码已经很好地体现了责任链模式的基本思想。我们平时使用的责任链模式只是在面向对象的基础上，将这段代码封装了一下。那么接下来我们就来对这段代码进行封装，将它变成规范的责任链模式的写法。

### “解决 bug” 程序 4.0
新建一个程序员抽象类：

```Java
public abstract class Programmer {
    protected Programmer next;

    public void setNext(Programmer next) {
        this.next = next;
    }

    abstract void handle(Bug bug);
}
```
在这个抽象类中：

- next 对象表示如果自己解决不了，需要将责任传递给的下一个人；
- handle 方法表示自己处理此 bug 的逻辑，在这里判断是自己解决或者继续传递。
![[Pasted image 20240107130933.png]]

新建菜鸟程序员类：

```Java
public class NewbieProgrammer extends Programmer {

    @Override
    public void handle(Bug bug) {
        if (bug.value > 0 && bug.value <= 20) {
            solve(bug);
        } else if (next != null) {
            next.handle(bug);
        }
    }

    private void solve(Bug bug) {
        System.out.println("菜鸟程序员解决了一个难度为 " + bug.value + " 的 bug");
    }
}
```
新建普通程序员类：

```Java
public class NormalProgrammer extends Programmer {

    @Override
    public void handle(Bug bug) {
        if (bug.value > 20 && bug.value <= 50) {
            solve(bug);
        } else if (next != null) {
            next.handle(bug);
        }
    }

    private void solve(Bug bug) {
        System.out.println("普通程序员解决了一个难度为 " + bug.value + " 的 bug");
    }
}
```
新建优秀程序员类：

```Java
public class GoodProgrammer extends Programmer {

    @Override
    public void handle(Bug bug) {
        if (bug.value > 50 && bug.value <= 100) {
            solve(bug);
        } else if (next != null) {
            next.handle(bug);
        }
    }

    private void solve(Bug bug) {
        System.out.println("优秀程序员解决了一个难度为 " + bug.value + " 的 bug");
    }
}
```
客户端测试：

```Java
import org.junit.Test;

public class Client4 {
    @Test
    public void test() {
        NewbieProgrammer newbie = new NewbieProgrammer();
        NormalProgrammer normal = new NormalProgrammer();
        GoodProgrammer good = new GoodProgrammer();

        Bug easy = new Bug(20);
        Bug middle = new Bug(50);
        Bug hard = new Bug(100);

        // 组成责任链
        newbie.setNext(normal);
        normal.setNext(good);

        // 从菜鸟程序员开始，沿着责任链传递
        newbie.handle(easy);
        newbie.handle(middle);
        newbie.handle(hard);
    }
}
```
在客户端中，我们通过 setNext() 方法将三个程序员组成了一条责任链，由菜鸟程序员接收所有的 bug，发现自己不能处理的 bug，就传递给普通程序员，普通程序员收到 bug 后，如果发现自己不能解决，则传递给优秀程序员，这就是规范的责任链模式的写法了。

责任链思想在生活中有很多应用，比如假期审批、加薪申请等，在员工提出申请后，从经理开始，由你的经理决定自己处理或是交由更上一层的经理处理。

再比如处理客户投诉时，从基层的客服人员开始，决定自己回应或是上报给领导，领导再判断是否继续上报。

理清了责任链模式，笔者突然回想起，公司的测试组每次提出 bug 后，总是先指派给我！一瞬间仿佛明白了什么了不得的道理，不禁陷入了沉思。

### 责任链模式小结
通过这个例子，我们已经了解到，责任链主要用于处理**职责相同，程度不同的**类。

其主要优点有：

- 降低了对象之间的耦合度。在责任链模式中，客户只需要将请求发送到责任链上即可，无须关心请求的处理细节和请求的传递过程，所以责任链将请求的**发送者**和请求的**处理者**解耦了。
- 扩展性强，满足开闭原则。可以根据需要增加新的请求处理类。
- 灵活性强。可以动态地改变链内的成员或者改变链的次序来适应流程的变化。
- 简化了对象之间的连接。每个对象只需保持一个指向其后继者的引用，不需保持其他所有处理者的引用，这避免了使用众多的条件判断语句。
- 责任分担。每个类只需要处理自己该处理的工作，不该处理的传递给下一个对象完成，明确各类的责任范围，符合类的单一职责原则。不再需要 “项目经理” 来处理所有的责任分配任务。

但我们在使用中也发现了它的一个明显缺点，如果这个 bug 没人处理，可能导致 “程序员祭天” 异常。其主要缺点有：

- 不能保证每个请求一定被处理，该请求可能一直传到链的末端都得不到处理。
- 如果责任链过长，请求的处理可能涉及多个处理对象，系统性能将受到一定影响。
- 责任链建立的合理性要靠客户端来保证，增加了客户端的复杂性，可能会由于责任链拼接次序错误而导致系统出错，比如可能出现循环调用。

### 习题
**多选题**    5 个海盗抢得 100 枚金币，他们的代号为 ABCDE，他们将按照字母顺序依次提出金币的分配方案。首先由 A 提出分配方案，然后 5 人表决，如果支持此方案的人数不超过投票人数的一半，那么 A 将被扔入大海喂鲨鱼，然后由 B 继续提方案，依此类推。

假定每个海盗都绝顶聪明，并且相当理智，那么海盗 A 应该提出怎样的分配方案才能够使自己的收益最大化？

- [ ] A    ABCDE 分别得：20，20，20，20，20
- [ ] B    ABCDE 分别得：0，25，25，25，25
- [ ] C    ABCDE 分别得：97，0，1，0，2
- [ ] D    ABCDE 分别得：97，0，1，2，0

**解析**    倒着推，因为规则是超过投票人数一半才不会死，所以如果只剩下 DE 两人，D 提出任何方案都会被 E 反对，然后被 E 独得 100 金币。D 知晓这一点，所以 D 一定会保 C 不死，C 知道 D 一定会帮自己，所以 C 一定会把 100 个金币都收走，DE 什么都得不到。B 知道这一点，所以 B 只需要给 D 和 E 每人一个金币，剩下 98 个给自己。因为对于支持 C 而言，支持 B 收益更多，所以 D 和 E 都会支持 B 的提议。所以对于 A 来说，A 只需要多给 D 或者 E 一枚金币，再给什么都没有的 C 一枚金币，让这两个人同意自己的方案即可。

那么这个问题和责任链模式有什么关系吗？这个...见本文[[#^a76727|第二段]]。