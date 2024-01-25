---
dg-publish: true
---
> 模板方法模式（Template Method Pattern）：定义一个操作中的算法的骨架，而将一些步骤延迟到子类中。模板方法使得子类可以不改变一个算法的结构即可重定义该算法的某些特定步骤。

通俗地说，模板方法模式就是一个关于继承的设计模式。

每一个被继承的父类都可以认为是一个模板，它的某些步骤是稳定的，某些步骤被延迟到子类中实现。

这和我们平时生活中使用的模板也是一样的。比如我们请假时，通常会给我们一份请假条模板，内容是已经写好的，只需要填写自己的姓名和日期即可。

> 本人 ____ 因 ____ 需请假 ___ 天，望批准！

这个模板用代码表示如下：

```Java
Abstract class LeaveRequest {
    
    void request() {
        System.out.print("本人");
        System.out.print(name());
        System.out.print("因");
        System.out.print(reason());
        System.out.print("需请假");
        System.out.print(duration());
        System.out.print("天，望批准");
    }

    abstract String name();

    abstract String reason();

    abstract String duration();
}
```
在这份模板中，所有的其他步骤（固定字符串）都是稳定的，只有姓名、请假原因、请假时长是抽象的，需要延迟到子类去实现。

继承此模板，实现具体步骤的子类：

```Java
Class MyLeaveRequest extends LeaveRequest {
    @Override
    String name () {
        Return "阿笠";
    }

    @Override
    String reason() {
        return "参加力扣周赛";
    }

    @Override
    String duration() {
        return "0.5";
    }
}
```
测试：

```Java
// 输出：本人阿笠因参加力扣周赛需请假 0.5 天，望批准
New MyLeaveRequest (). Request ();
```
在使用模板方法模式时，我们可以为不同的模板方法设置不同的控制权限：

- 如果不希望子类覆写模板中的某个方法，使用 final 修饰此方法；
- 如果要求子类必须覆写模板中的某个方法，使用 abstract 修饰此方法；
- 如果没有特殊要求，可使用 protected 或 public 修饰此方法，子类可根据实际情况考虑是否覆写。