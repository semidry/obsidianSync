---
dg-publish: true
---
备忘录模式最常见的实现就是游戏中的存档、读档功能，通过存档、读档，使得我们可以随时恢复到之前的状态。

当我们在玩游戏时，打大 Boss 之前，通常会将自己的游戏进度存档保存，以保证自己打不过 Boss 的话，还能重新读档恢复状态。

玩家类：

```Java
class Player {
    // 生命值
    private int life = 100;
    // 魔法值
    private int magic = 100;

    public void fightBoss() {
        life -= 100;
        magic -= 100;
        if (life <= 0) {
            System.out.println("壮烈牺牲");
        }
    }

    public int getLife() {
        return life;
    }

    public void setLife(int life) {
        this.life = life;
    }

    public int getMagic() {
        return magic;
    }

    public void setMagic(int magic) {
        this.magic = magic;
    }
}
```
我们为玩家定义了两个属性：生命值和魔法值。其中有一个 fightBoss() 方法，每次打 Boss 都会扣减 100 点体力、100 点魔法值。如果生命值小于等于 0，则提示用户已“壮烈牺牲”。

客户端实现如下：

```Java
public class Client {
    @Test
    public void test() {
        Player player = new Player();
        // 存档
        int savedLife = player.getLife();
        int savedMagic = player.getMagic();

        // 打 Boss，打不过，壮烈牺牲
        player.fightBoss();

        // 读档，恢复到打 Boss 之前的状态
        player.setLife(savedLife);
        player.setMagic(savedMagic);
    }
}
```
客户端中，我们在 fightBoss() 之前，先去存档，把自己当前的生命值和魔法值保存起来。打完 Boss 发现自己牺牲之后，再回去读档，将自己恢复到打 Boss 之前的状态。

这就是备忘录模式......吗？不完全是，事情并没有这么简单。

还记得我们在 [[原型模式 Prototype|原型模式]] 中，买的那杯和周杰伦一模一样的奶茶吗？开始时，为了克隆一杯奶茶，我们将奶茶的各个属性分别赋值成和周杰伦买的那杯奶茶一样。但这样存在一个弊端：我们不可能为一千个粉丝写一千份挨个赋值操作。所以最终我们在奶茶类内部实现了 Cloneable 接口，定义了 clone() 方法，来实现一行代码拷贝所有属性。

备忘录模式也应该采取类似的做法。我们不应该采用将单个属性挨个存取的方式来进行读档、存档。更好的做法是将存档、读档交给需要存档的类内部去实现。

新建备忘录类：

```Java
class Memento {
    int life;
    int magic;

    Memento(int life, int magic) {
        this.life = life;
        this.magic = magic;
    }
}
```
在此类中，管理需要存档的数据。

玩家类中，通过备忘录类实现存档、读档：

```Java
class Player {
    ...

    // 存档
    public Memento saveState() {
        return new Memento(life, magic);
    }

    // 读档
    public void restoreState(Memento memento) {
        this.life = memento.life;
        this.magic = memento.magic;
    }
}
```
客户端类对应修改如下：

```Java
public class Client {
    @Test
    public void test() {
        Player player = new Player();
        // 存档
        Memento memento = player.saveState();

        // 打 Boss，打不过，壮烈牺牲
        player.fightBoss();

        // 读档
        player.restoreState(memento);
    }
}
```
这才是完整的备忘录模式。这个设计模式的定义如下：

> 备忘录模式：在不破坏封装的条件下，通过备忘录对象存储另外一个对象内部状态的快照，在将来合适的时候把这个对象还原到存储起来的状态。

备忘录模式的优点是：

- 给用户提供了一种可以恢复状态的机制，使用户能够比较方便的回到某个历史的状态
- 实现了信息的封装，使得用户不需要关心状态的保存细节

缺点是：

- 消耗资源，如果类的成员变量过多，势必会占用比较大的资源，而且每一次保存都会消耗一定的内存。

总体而言，备忘录模式是利大于弊的，所以许多程序都为用户提供了备份方案。比如 IDE 中，用户可以将自己的设置导出成 zip，当需要恢复设置时，再将导出的 zip 文件导入即可。这个功能内部的原理就是备忘录模式。
![[Pasted image 20240107205215.png]]