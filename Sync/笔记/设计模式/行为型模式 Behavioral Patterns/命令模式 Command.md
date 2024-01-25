---
dg-publish: true
---
近年来，智能家居越来越流行。躺在家中，只需要打开对应的 app，就可以随手控制家电开关。但随之而来一个问题，手机里的 app 实在是太多了，每一个家具公司都想要提供一个 app 给用户，以求增加用户粘性，推广他们的其他产品等。

站在用户的角度来看，有时我们只想打开一下电灯，却要先看到恼人的 “新式电灯上新” 的弹窗通知，让人烦不胜烦。如果能有一个万能遥控器将所有的智能家居开关综合起来，统一控制，一定会方便许多。

说干就干，笔者立马打开 PS，设计了一张草图：

![[Pasted image 20240107142145.png]]

“咳咳，我对这个 app 的设计理念呢，是基于 “简洁就是美” 的原则。一个好的设计，首先，最重要的一点就是 '接地气'。当然，我也可以用一些华丽的素材拼接出一个花里胡哨的设计，但，那是一个最低级的设计师才会做的事情...”

> 翻译：He has no UI design skills.

总之 UI 设计完成啦，我们再来看下四个智能家居类的结构。

大门类：

```Java
public class Door {
    public void openDoor() {
        System.out.println("门打开了");
    }

    public void closeDoor() {
        System.out.println("门关闭了");
    }
}
```
电灯类：

```Java
public class Light {
    public void lightOn() {
        System.out.println("打开了电灯");
    }

    public void lightOff() {
        System.out.println("关闭了电灯");
    }
}
```
电视类：

```Java
public class Tv {
    public void TurnOnTv() {
        System.out.println("电视打开了");
    }

    public void TurnOffTv() {
        System.out.println("电视关闭了");
    }
}
```
音乐类：

```Java
public class Music {
    public void play() {
        System.out.println("开始播放音乐");
    }

    public void stop() {
        System.out.println("停止播放音乐");
    }
}
```
由于是不同公司的产品，所以接口有所不同，接下来就一起来实现我们的万能遥控器！

### 万能遥控器 1.0
不一会儿，我们就写出了下面的代码：

```Java
// 初始化开关
Switch switchDoor = 省略绑定UI代码;
Switch switchLight = 省略绑定UI代码;
Switch switchTv = 省略绑定UI代码;
Switch switchMusic = 省略绑定UI代码;

// 初始化智能家居
Door door = new Door();
Light light = new Light();
Tv tv = new Tv();
Music music = new Music();

// 大门开关遥控
switchDoor.setOnCheckedChangeListener((view, isChecked) -> {
    if (isChecked) {
        door.openDoor();
    } else {
        door.closeDoor();
    }
});
// 电灯开关遥控
switchLight.setOnCheckedChangeListener((view, isChecked) -> {
    if (isChecked) {
        light.lightOn();
    } else {
        light.lightOff();
    }
});
// 电视开关遥控
switchTv.setOnCheckedChangeListener((view, isChecked) -> {
    if (isChecked) {
        tv.TurnOnTv();
    } else {
        tv.TurnOffTv();
    }
});
// 音乐开关遥控
switchMusic.setOnCheckedChangeListener((view, isChecked) -> {
    if (isChecked) {
        music.play();
    } else {
        music.stop();
    }
});
```
这份代码很直观，在每个开关状态改变时，调用对应家居的 API 实现打开或关闭。

只有这样的功能实在是太单一了，接下来我们再为它添加一个有趣的功能。

### 万能遥控器 2.0
一般来说，电视遥控器上都有一个回退按钮，用来回到上一个频道。相当于文本编辑器中的 “撤销” 功能，既然别的小朋友都有，那我们也要！

设计狮本狮马不停蹄地设计了 UI 2.0：



UI 设计倒是简单，底部添加一个按钮即可。代码设计就比较复杂了，我们需要保存上一步操作，并且将其回退。

一个很容易想到的想法是：设计一个枚举类 Operation，代表每一步的操作：

```Java
public enum Operation {
    DOOR_OPEN,
    DOOR_CLOSE,
    LIGHT_ON,
    LIGHT_OFF,
    TV_TURN_ON,
    TV_TURN_OFF,
    MUSIC_PLAY,
    MUSIC_STOP
}
```
然后在客户端定义一个 Operation 变量，变量名字叫 lastOperation，在每一步操作后，更新此变量。然后在撤销按钮的点击事件中，根据上一步的操作实现回退：

```Java
public class Client {

    // 上一步的操作
    Operation lastOperation;
    
    @Test
    protected void test() {
        
        // 初始化开关和撤销按钮
        Switch switchDoor = 省略绑定UI代码;
        Switch switchLight = 省略绑定UI代码;
        Switch switchTv = 省略绑定UI代码;
        Switch switchMusic = 省略绑定UI代码;
        Button btnUndo = 省略绑定UI代码;

        // 初始化智能家居
        Door door = new Door();
        Light light = new Light();
        Tv tv = new Tv();
        Music music = new Music();

        // 大门开关遥控
        switchDoor.setOnCheckedChangeListener((view, isChecked) -> {
            if (isChecked) {
                lastOperation = Operation.DOOR_OPEN;
                door.openDoor();
            } else {
                lastOperation = Operation.DOOR_CLOSE;
                door.closeDoor();
            }
        });

        // 电灯开关遥控
        switchLight.setOnCheckedChangeListener((view, isChecked) -> {
            if (isChecked) {
                lastOperation = Operation.LIGHT_ON;
                light.lightOn();
            } else {
                lastOperation = Operation.LIGHT_OFF;
                light.lightOff();
            }
        });

        ... 电视、音乐类似

        btnUndo.setOnClickListener(view -> {
            if (lastOperation == null) return;
            // 撤销上一步
            switch (lastOperation) {
                case DOOR_OPEN:
                    door.closeDoor();
                    break;
                case DOOR_CLOSE:
                    door.openDoor();
                    break;
                case LIGHT_ON:
                    light.lightOff();
                    break;
                case LIGHT_OFF:
                    light.lightOn();
                    break;
                ... 电视、音乐类似
            }
        });
    }
}
```
大功告成，不过这份代码只实现了撤销一步，如果我们需要实现撤销多步怎么做呢？

思考一下，每次回退时，都是先将最后一步 Operation 撤销。对于这种后进先出的结构，我们自然就会想到——栈结构。使用栈结构实现回退多步的代码如下：

```Java
public class Client {

    // 所有的操作
    Stack<Operation> operations = new Stack<>();

    @Test
    protected void test() {

        // 初始化开关和撤销按钮
        Switch switchDoor = 省略绑定UI代码;
        Switch switchLight = 省略绑定UI代码;
        Switch switchTv = 省略绑定UI代码;
        Switch switchMusic = 省略绑定UI代码;
        Button btnUndo = 省略绑定UI代码;

        // 初始化智能家居
        Door door = new Door();
        Light light = new Light();
        Tv tv = new Tv();
        Music music = new Music();

        // 大门开关遥控
        switchDoor.setOnCheckedChangeListener((view, isChecked) -> {
            if (isChecked) {
                operations.push(Operation.DOOR_OPEN);
                door.openDoor();
            } else {
                operations.push(Operation.DOOR_CLOSE);
                door.closeDoor();
            }
        });

        // 电灯开关遥控
        switchLight.setOnCheckedChangeListener((view, isChecked) -> {
            if (isChecked) {
                operations.push(Operation.LIGHT_ON);
                light.lightOn();
            } else {
                operations.push(Operation.LIGHT_OFF);
                light.lightOff();
            }
        });

        ...电视、音乐类似

        // 撤销按钮
        btnUndo.setOnClickListener(view -> {
            if (operations.isEmpty()) return;
            // 弹出栈顶的上一步操作
            Operation lastOperation = operations.pop();
            // 撤销上一步
            switch (lastOperation) {
                case DOOR_OPEN:
                    door.closeDoor();
                    break;
                case DOOR_CLOSE:
                    door.openDoor();
                    break;
                case LIGHT_ON:
                    light.lightOff();
                    break;
                case LIGHT_OFF:
                    light.lightOn();
                    break;
                ...电视、音乐类似
            }
        });
    }
}
```
我们将每一步 Operation 记录到栈中，每次撤销时，弹出栈顶的 Operation，再使用 switch 语句判断，将其恢复。

虽然实现了功能，但代码明显已经变得越来越臃肿了，因为遥控器知道了太多的细节，它必须要知道每个家居的调用方式。以后有开关加入时，不仅要修改 Status 类，增加新的 Operation，还要修改客户端，增加新的分支判断，导致这个类变成一个庞大的类。不仅违背了单一权责原则，还违背了开闭原则，所以我们不得不思考怎么优化这份代码。

### 万能遥控器 3.0
我们期待能有一种设计，让遥控器不需要知道家居的接口。它只需要负责监听用户按下开关，再根据开关状态发出正确的命令，对应的家居在收到命令后做出响应。就可以达到将 “**行为请求者”** 和 ”**行为实现者**“ 解耦的目的。

先定义一个命令接口：

```Java
public interface ICommand {
    void execute();
}
接口中只有一个 execute 方法，表示 “执行” 命令。

定义开门命令，实现此接口：

Java

public class DoorOpenCommand implements ICommand {
    private Door door;

    public void setDoor(Door door) {
        this.door = door;
    }

    @Override
    public void execute() {
        door.openDoor();
    }
}
```
关门命令：

```Java
public class DoorCloseCommand implements ICommand {
    private Door door;

    public void setDoor(Door door) {
        this.door = door;
    }


    @Override
    public void execute() {
        door.closeDoor();
    }
}
```
开灯命令：

```Java
public class LightOnCommand implements ICommand {

    Light light;

    public void setLight(Light light) {
        this.light = light;
    }

    @Override
    public void execute() {
        light.lightOn();
    }
}
```
关灯命令：

```Java
public class LightOffCommand implements ICommand {

    Light light;

    public void setLight(Light light) {
        this.light = light;
    }

    @Override
    public void execute() {
        light.lightOff();
    }
}
```
电视、音乐的命令类似。

可以看到，我们将家居控制的代码转移到了命令类中，当命令执行时，调用对应家具的 API 实现开启或关闭。

客户端代码：

```Java
// 初始化命令
DoorOpenCommand doorOpenCommand = new DoorOpenCommand();
DoorCloseCommand doorCloseCommand = new DoorCloseCommand();
doorOpenCommand.setDoor(door);
doorCloseCommand.setDoor(door);
LightOnCommand lightOnCommand = new LightOnCommand();
LightOffCommand lightOffCommand = new LightOffCommand();
lightOnCommand.setLight(light);
lightOffCommand.setLight(light);

...电视、音乐类似

// 大门开关遥控
switchDoor.setOnCheckedChangeListener((view, isChecked) -> {
    if (isChecked) {
        doorOpenCommand.execute();
    } else {
        doorCloseCommand.execute();
    }
});
// 电灯开关遥控
switchLight.setOnCheckedChangeListener((view, isChecked) -> {
    if (isChecked) {
        lightOnCommand.execute();
    } else {
        lightOffCommand.execute();
    }
});
...电视、音乐类似
```
现在，遥控器只知道用户控制开关后，需要执行对应的命令，遥控器并不知道这个命令会执行什么内容，它只负责调用 execute 方法，达到了隐藏技术细节的目的。

与此同时，我们还获得了一个附带的好处。由于每个命令都被抽象成了同一个接口，我们可以将开关代码统一起来。客户端优化如下：

```Java
public class Client {

    @Test
    protected void test() {
        ...初始化

        // 大门开关遥控
        switchDoor.setOnCheckedChangeListener((view, isChecked) -> {
            handleCommand(isChecked, doorOpenCommand, doorCloseCommand);
        });
        // 电灯开关遥控
        switchLight.setOnCheckedChangeListener((view, isChecked) -> {
            handleCommand(isChecked, lightOnCommand, lightOffCommand);
        });
        // 电视开关遥控
        switchTv.setOnCheckedChangeListener((view, isChecked) -> {
            handleCommand(isChecked, turnOnTvCommand, turnOffTvCommand);
        });
        // 音乐开关遥控
        switchMusic.setOnCheckedChangeListener((view, isChecked) -> {
            handleCommand(isChecked, musicPlayCommand, musicStopCommand);
        });
    }

    private void handleCommand(boolean isChecked, ICommand openCommand, ICommand closeCommand) { 
        if (isChecked) {
            openCommand.execute();
        } else {
            closeCommand.execute();
        }
    }
}
```
不知不觉中，我们就写出了命令模式的代码。来看下命令模式的定义：

> 命令模式：将一个请求封装为一个对象，从而使你可用不同的请求对客户进行参数化，对请求排队或记录请求日志，以及支持可撤销的操作。

使用命令模式后，现在我们要实现撤销功能会非常容易。

首先，在命令接口中，新增 undo 方法：

```Java
public interface ICommand {
    
    void execute();

    void undo();
}
```
开门命令中新增 undo：

```Java
public class DoorOpenCommand implements ICommand {
    private Door door;

    public void setDoor(Door door) {
        this.door = door;
    }

    @Override
    public void execute() {
        door.openDoor();
    }

    @Override
    public void undo() {
        door.closeDoor();
    }
}
```
关门命令中新增 undo：

```Java
public class DoorCloseCommand implements ICommand {
    private Door door;

    public void setDoor(Door door) {
        this.door = door;
    }

    @Override
    public void execute() {
        door.closeDoor();
    }

    @Override
    public void undo() {
        door.openDoor();
    }
}
```
开灯命令中新增 undo：

```Java
public class LightOnCommand implements ICommand {

    Light light;

    public void setLight(Light light) {
        this.light = light;
    }

    @Override
    public void execute() {
        light.lightOn();
    }

    @Override
    public void undo() {
        light.lightOff();
    }
}
```
关灯命令中新增 undo：

```Java
public class LightOffCommand implements ICommand {

    Light light;

    public void setLight(Light light) {
        this.light = light;
    }

    @Override
    public void execute() {
        light.lightOff();
    }

    @Override
    public void undo() {
        light.lightOn();
    }
}
```
电视、音乐命令类似。

客户端：

```Java
public class Client {

    // 所有的命令
    Stack<ICommand> commands = new Stack<>();

    @Test
    protected void test() {
        ...初始化

        // 大门开关遥控
        switchDoor.setOnCheckedChangeListener((view, isChecked) -> {
            handleCommand(isChecked, doorOpenCommand, doorCloseCommand);
        });
        // 电灯开关遥控
        switchLight.setOnCheckedChangeListener((view, isChecked) -> {
            handleCommand(isChecked, lightOnCommand, lightOffCommand);
        });
        // 电视开关遥控
        switchTv.setOnCheckedChangeListener((view, isChecked) -> {
            handleCommand(isChecked, turnOnTvCommand, turnOffTvCommand);
        });
        // 音乐开关遥控
        switchMusic.setOnCheckedChangeListener((view, isChecked) -> {
            handleCommand(isChecked, musicPlayCommand, musicStopCommand);
        });

        // 撤销按钮
        btnUndo.setOnClickListener(view -> {
            if (commands.isEmpty()) return;
            // 撤销上一个命令
            ICommand lastCommand = commands.pop();
            lastCommand.undo();
        });
    }

    private void handleCommand(boolean isChecked, ICommand openCommand, ICommand closeCommand) {
        if (isChecked) {
            commands.push(openCommand);
            openCommand.execute();
        } else {
            commands.push(closeCommand);
            closeCommand.execute();
        }
    }
}
```
我们同样使用了一个栈结构，用于存储所有的命令，在每次执行命令前，将命令压入栈中。撤销时，弹出栈顶的命令，执行其 undo 方法即可。

命令模式使得客户端的职责更加简洁、清晰了，命令执行、撤销的代码都被隐藏到了命令类中。唯一的缺点是 —— 多了很多的命令类，因为我们必须针对每一个命令都设计一个命令类，容易导致类爆炸。

除了撤销方便外，命令模式还有一个优点，那就是宏命令的使用，宏命令也就是组合多个命令的 “宏大的命令”。

### 宏命令
在我们学习宏命令前，先来了解一下宏。在使用 word 时，有时会弹出一个提示：是否启用宏？

![[Pasted image 20240107142321.png]]

在笔者小的时候（当然现在也没有很老），小小的眼睛里有大大的疑惑：这个 “宏” 是什么意思呢？简简单单一个字，却看起来如此的高大上，一定是一个很难的东西吧。

其实宏一点也不难，宏（英语：Macro）的意思是 “批量处理”，能够帮我们实现合并多个操作。

比如，在 word 中，我们需要设置一个文字加粗、斜体和字号 36。通常来说，我们需要三个步骤：

- 选中文字，设置加粗
- 选中文字，设置斜体
- 选中文字，设置字号 36
如果有一个设置，能一键实现这三个步骤，这个设置就称为一个宏。

（就这？）

如果我们有大量的文字需要这三个设置，定义一个宏就可以省下许多重复操作。

听起来是不是很像格式刷，不过宏远比格式刷要强大。比如宏可以实现将一段文字一键加上 【】，在 Excel 中的宏还可以一键实现 居中 + 排序 等操作。

比如笔者写的一个宏，效果是运行时给两个汉字自动加上中括号：

![[1648087245-fsBrYf-TewnnGIm_HYPC.gif]]

这个宏对应的 vba 代码长这样：


```
Sub Macro1()
'
' Macro1 Macro
'
'
    Selection.TypeText Text:=ChrW(12304)
    Selection.MoveRight Unit:=wdCharacter, Count:=2
    Selection.TypeText Text:=ChrW(12305)
End Sub
```
它执行的逻辑就是先添加【，再向后移动两个字符，再添加】，这个宏帮我们一键实现了三个步骤。

当然这份 vba 代码完全是笔者为了秀一秀，不是我们讲解的重点。

重点是了解了宏，就不难理解宏命令了。宏命令就是 将多个命令合并起来组成的命令。

接下来我们给遥控器添加一个 “睡眠” 按钮，按下时可以一键关闭大门，关闭电灯，关闭电视、打开音乐（听着音乐睡觉，就是这么优雅）。UI 设计...就不看了吧，这时就可以使用宏命令：

```Java
public class MacroCommand implements ICommand {
    // 定义一组命令
    List<ICommand> commands;

    public MacroCommand(List<ICommand> commands) {
        this.commands = commands;
    }

    @Override
    public void execute() {
        // 宏命令执行时，每个命令依次执行
        for (int i = 0; i < commands.size(); i++) {
            commands.get(i).execute();
        }
    }

    @Override
    public void undo() {
        // 宏命令撤销时，每个命令依次撤销
        for (int i = 0; i < commands.size(); i++) {
            commands.get(i).undo();
        }
    }
}
```
有了宏命令，我们就可以任意组合多个命令，并且完全不会增加程序结构的复杂度。

客户端代码如下：

```Java
// 定义睡眠宏命令
MacroCommand sleepCommand = new MacroCommand(Arrays.asList(doorCloseCommand, lightOffCommand, turnOffTvCommand, musicPlayCommand));
// 睡眠按钮
btnSleep.setOnClickListener(view -> {
    // 将执行的命令保存到栈中，以便撤销
    commands.push(sleepCommand);
    // 执行睡眠命令
    sleepCommand.execute();
});
```
可以看到，我们将 doorCloseCommand, lightOffCommand, turnOffTvCommand, musicPlayCommand 三个命令组合到了宏命令 sleepCommand 中，这个宏命令的使用方式和普通命令一模一样，因为它本身也是一个实现了 ICommand 接口的命令而已。

### 请求排队
前文的定义中讲到，命令模式还可以用于请求排队。那么怎么实现请求排队功能呢？

要实现请求排队功能，只需创建一个命令队列，将每个需要执行的命令依次传入队列中，然后工作线程不断地从命令队列中取出队列头的命令，再执行命令即可。

事实上，安卓 app 的界面就是这么实现的。源码中使用了一个阻塞式死循环 Looper，不断地从 MessageQueue 中取出消息，交给 Handler 处理，用户的每一个操作也会通过 Handler 传递到 MessageQueue 中排队执行。

### 命令模式小结
命令模式可以说将封装发挥得淋漓尽致。在我们平时的程序设计中，最常用的封装是将拥有一类职责的对象封装成类，而命令对象的唯一职责就是通过 execute 去调用一个方法，也就是说它将 “方法调用” 这个步骤封装起来了，使得我们可以对 “方法调用” 进行排队、撤销等处理。

命令模式的主要优点如下：

- 降低系统的耦合度。将 “行为请求者” 和 ”行为实现者“ 解耦。
- 扩展性强。增加或删除命令非常方便，并且不会影响其他类。
- 封装 “方法调用”，方便实现 Undo 和 Redo 操作。
- 灵活性强，可以实现宏命令。

它的主要缺点是：
- 会产生大量命令类。增加了系统的复杂性。