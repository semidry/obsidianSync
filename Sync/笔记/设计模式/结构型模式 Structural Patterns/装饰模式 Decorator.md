提到装饰，我们先来想一下生活中有哪些装饰：
- 女生的首饰：戒指、耳环、项链等装饰品
- 家居装饰品：粘钩、镜子、壁画、盆栽等等
我们为什么需要这些装饰品呢？我们很容易想到是为了美，戒指、耳环、项链、壁画、盆栽都是为了提高颜值或增加美观度。但粘钩、镜子不一样，它们是为了方便我们挂东西、洗漱。所以我们可以总结出装饰品共有两种功能：

- 增强原有的特性：我们本身就是有一定颜值的，添加装饰品提高了我们的颜值。同样地，房屋本身就有一定的美观度，家居装饰提高了房屋的美观度。
- 添加新的特性：在墙上挂上粘钩，让墙壁有了挂东西的功能。在洗漱台装上镜子，让洗漱台有了照镜子的功能。
并且我们发现，装饰品并不会改变物品本身，只是起到一个锦上添花的作用。装饰模式也一样，它的主要作用就是：

- 增强一个类原有的功能
- 为一个类添加新的功能
并且装饰模式也不会改变原有的类。

> 装饰模式：动态地给一个对象增加一些额外的职责，就增加对象功能来说，装饰模式比生成子类实现更为灵活。其别名也可以称为包装器，与适配器模式的别名相同，但它们适用于不同的场合。根据翻译的不同，装饰模式也有人称之为“油漆工模式”。

### 用于增强功能的装饰模式
我们用程序来模拟一下戴上装饰品提高我们颜值的过程：

新建颜值接口：

```Java
Public interface IBeauty {
    Int getBeautyValue ();
}
```
新建 Me 类，实现颜值接口：

```Java
Public class Me implements IBeauty {

    @Override
    public int getBeautyValue() {
        return 100;
    }
}
```
戒指装饰类，将 Me 包装起来：

```Java
Public class RingDecorator implements IBeauty {
    Private final IBeauty me;

    public RingDecorator(IBeauty me) {
        this.me = me;
    }

    @Override
    public int getBeautyValue() {
        return me.getBeautyValue() + 20;
    }
}
```
客户端测试：

```Java
Public class Client {
    @Test
    Public void show () {
        IBeauty me = new Me ();
        System.Out.Println ("我原本的颜值：" + me.GetBeautyValue ());

        IBeauty meWithRing = new RingDecorator(me);
        System.out.println("戴上了戒指后，我的颜值：" + meWithRing.getBeautyValue());
    }
}
```
运行程序，输出如下：


```
我原本的颜值：100
戴上了戒指后，我的颜值：120
```
这就是最简单的增强功能的装饰模式。以后我们可以添加更多的装饰类，比如：

耳环装饰类：

```Java
Public class EarringDecorator implements IBeauty {
    Private final IBeauty me;

    public EarringDecorator(IBeauty me) {
        this.me = me;
    }

    @Override
    public int getBeautyValue() {
        return me.getBeautyValue() + 50;
    }
}
```
项链装饰类：

```Java
Public class NecklaceDecorator implements IBeauty {
    Private final IBeauty me;

    public NecklaceDecorator(IBeauty me) {
        this.me = me;
    }

    @Override
    public int getBeautyValue() {
        return me.getBeautyValue() + 80;
    }
}
```
客户端测试：

```Java
Public class Client {
    @Test
    Public void show () {
        IBeauty me = new Me ();
        System.Out.Println ("我原本的颜值：" + me.GetBeautyValue ());

        // 随意挑选装饰
        IBeauty meWithNecklace = new NecklaceDecorator(me);
        System.out.println("戴上了项链后，我的颜值：" + meWithNecklace.getBeautyValue());

        // 多次装饰
        IBeauty meWithManyDecorators = new NecklaceDecorator(new RingDecorator(new EarringDecorator(me)));
        System.out.println("戴上耳环、戒指、项链后，我的颜值：" + meWithManyDecorators.getBeautyValue());

        // 任意搭配装饰
        IBeauty meWithNecklaceAndRing = new NecklaceDecorator(new RingDecorator(me));
        System.out.println("戴上戒指、项链后，我的颜值：" + meWithNecklaceAndRing.getBeautyValue());
    }
}
```
运行程序，输出如下：
```
我原本的颜值：100
戴上了项链后，我的颜值：180
戴上耳环、戒指、项链后，我的颜值：250
戴上戒指、项链后，我的颜值：200
```
可以看到，装饰器也实现了 IBeauty 接口，并且没有添加新的方法，也就是说这里的装饰器仅用于增强功能，并不会改变 Me 原有的功能，这种装饰模式称之为透明装饰模式，由于没有改变接口，也没有新增方法，所以透明装饰模式可以无限装饰。

装饰模式是继承的一种替代方案。本例如果不使用装饰模式，而是改用继承实现的话，戴着戒指的 Me 需要派生一个子类、戴着项链的 Me 需要派生一个子类、戴着耳环的 Me 需要派生一个子类、戴着戒指 + 项链的需要派生一个子类... 各种各样的排列组合会造成类爆炸。而采用了装饰模式就只需要为每个装饰品生成一个装饰类即可，所以说就增加对象功能来说，装饰模式比生成子类实现更为灵活。

### 用于添加功能的装饰模式
我们用程序来模拟一下房屋装饰粘钩后，新增了挂东西功能的过程：

新建房屋接口：

```Java
Public interface IHouse {
    Void live ();
}
```
房屋类：

```Java
Public class House implements IHouse{

    @Override
    public void live() {
        System.out.println("房屋原有的功能：居住功能");
    }
}
```
新建粘钩装饰器接口，继承自房屋接口：

```Java
Public interface IStickyHookHouse extends IHouse{
    Void hangThings ();
}
```
粘钩装饰类：

```Java
Public class StickyHookDecorator implements IStickyHookHouse {
    Private final IHouse house;

    public StickyHookDecorator(IHouse house) {
        this.house = house;
    }

    @Override
    public void live() {
        house.live();
    }

    @Override
    public void hangThings() {
        System.out.println("有了粘钩后，新增了挂东西功能");
    }
}
```
客户端测试：

```Java
Public class Client {
    @Test
    Public void show () {
        IHouse house = new House ();
        House.Live ();

        IStickyHookHouse stickyHookHouse = new StickyHookDecorator(house);
        stickyHookHouse.live();
        stickyHookHouse.hangThings();
    }
}
```
运行程序，显示如下：


```
房屋原有的功能：居住功能
房屋原有的功能：居住功能
有了粘钩后，新增了挂东西功能
```
这就是用于新增功能的装饰模式。我们在接口中新增了方法：hangThings，然后在装饰器中将 House 类包装起来，之前 House 中的方法仍然调用 house 去执行，也就是说我们并没有修改原有的功能，只是**扩展了新的功能**，这种模式在装饰模式中称之为**半透明装饰模式**。

为什么叫半透明呢？由于新的接口 IStickyHookHouse 拥有之前 IHouse 不具有的方法，所以我们如果要使用装饰器中添加的功能，就不得不区别对待装饰前的对象和装饰后的对象。也就是说客户端要使用新方法，必须知道具体的装饰类 StickyHookDecorator，所以这个装饰类对客户端来说是可见的、不透明的。而被装饰者不一定要是 House，它可以是实现了 IHouse 接口的任意对象，所以被装饰者对客户端是不可见的、透明的。由于一半透明，一半不透明，所以称之为半透明装饰模式。

我们可以添加更多的装饰器：

新建镜子装饰器的接口，继承自房屋接口：

```Java
Public interface IMirrorHouse extends IHouse {
    Void lookMirror ();
}
```
镜子装饰类：

```Java
Public class MirrorDecorator implements IMirrorHouse{
    Private final IHouse house;

    public MirrorDecorator(IHouse house) {
        this.house = house;
    }

    @Override
    public void live() {
        house.live();
    }

    @Override
    public void lookMirror() {
        System.out.println("有了镜子后，新增了照镜子功能");
    }
}
```
客户端测试：

```Java
Public class Client {
    @Test
    Public void show () {
        IHouse house = new House ();
        House.Live ();

        IMirrorHouse mirrorHouse = new MirrorDecorator(house);
        mirrorHouse.live();
        mirrorHouse.lookMirror();
    }
}
```
运行程序，输出如下：
```
房屋原有的功能：居住功能
房屋原有的功能：居住功能
有了镜子后，新增了照镜子功能
```
现在我们仿照透明装饰模式的写法，同时添加粘钩和镜子装饰试一试：

```Java
Public class Client {
    @Test
    Public void show () {
        IHouse house = new House ();
        House.Live ();

        IStickyHookHouse stickyHookHouse = new StickyHookDecorator(house);
        IMirrorHouse houseWithStickyHookMirror = new MirrorDecorator(stickyHookHouse);
        houseWithStickyHookMirror.live();
        houseWithStickyHookMirror.hangThings(); // 这里会报错，找不到 hangThings 方法
        houseWithStickyHookMirror.lookMirror();
    }
}
```
我们会发现，第二次装饰时，无法获得上一次装饰添加的方法。原因很明显，当我们用 IMirrorHouse 装饰器后，接口变为了 IMirrorHouse，这个接口中并没有 hangThings 方法。

那么我们能否让 IMirrorHouse 继承自 IStickyHookHouse，以实现新增两个功能呢？可以，但那样做的话两个装饰类之间有了依赖关系，那就不是装饰模式了。装饰类不应该存在依赖关系，而应该在原本的类上进行装饰。这就意味着，**半透明装饰模式中，我们无法多次装饰**。

有的同学会问了，既增强了功能，又添加了新功能的装饰模式叫什么呢？

—— 举一反三，肯定是叫全不透明装饰模式！

—— 并不是！只要添加了新功能的装饰模式都称之为半透明装饰模式，他们都具有不可以多次装饰的特点。仔细理解上文半透明名称的由来就知道了，“透明”指的是我们无需知道被装饰者具体的类，既增强了功能，又添加了新功能的装饰模式仍然具有半透明特性。

看了这两个简单的例子，是不是发现装饰模式很简单呢？恭喜你学会了 1 + 1 = 2，现在你已经掌握了算数的基本思想，接下来我们来做一道微积分题练习一下。

### I/O 中的装饰模式
I/O 指的是 Input/Output，即输入、输出。我们以 Input 为例。先在 src 文件夹下新建一个文件 readme. Text，随便写点文字：


```
禁止套娃
禁止禁止套娃
禁止禁止禁止套娃
```
然后用 Java 的 InputStream 读取，代码一般长这样：

```Java
Public void io () throws IOException {
    InputStream in = new BufferedInputStream (new FileInputStream ("src/readme. Txt"));
    Byte[] buffer = new byte[1024];
    While (in.Read (buffer) != -1) {
        System.Out.Println (new String (buffer));
    }
    In.Close ();
}
```
这样写有一个问题，如果读取过程中出现了 IO 异常，InputStream 就不能正确的关闭，所以我们要用 try... Finally 来保证 InputStream 正确关闭：

```Java
Public void io () throws IOException {
    InputStream in = null;
    Try {
        In = new BufferedInputStream (new FileInputStream ("src/readme. Txt"));
        Byte[] buffer = new byte[1024];
        While (in.Read (buffer) != -1) {
            System.Out.Println (new String (buffer));
        }
    } finally {
        If (in != null) {
            In.Close ();
        }
    }
}
```
这种写法实在是太丑了，而 IO 操作又必须这么写，显然 Java 也意识到了这个问题，所以 Java 7 中引入了 try (resource)语法糖，IO 的代码就可以简化如下：

```Java
Public void io () throws IOException {
    Try (InputStream in = new BufferedInputStream (new FileInputStream ("src/readme. Txt"))) {
        Byte[] buffer = new byte[1024];
        While (in.Read (buffer) != -1) {
            System.Out.Println (new String (buffer));
        }
    }
}
```
这种写法和上一种逻辑是一样的，运行程序，显示如下：


```
禁止套娃
禁止禁止套娃
禁止禁止禁止套娃
```
观察获取 InputStream 这句代码：

```Java
InputStream in = new BufferedInputStream (new FileInputStream ("src/readme. Txt"));
```
是不是和我们之前多次装饰的代码非常相似：

```Java
// 多次装饰
IBeauty meWithManyDecorators = new NecklaceDecorator (new RingDecorator (new EarringDecorator (me)));
```
事实上，查看 I/O 的源码可知，Java I/O 的设计框架便是使用的装饰者模式，InputStream 的继承关系如下：

![[Pasted image 20240104172904.png]]

其中，InputStream 是一个抽象类，对应上文例子中的 IHouse，其中最重要的方法是 read 方法，这是一个抽象方法：

```Java
Public abstract class InputStream implements Closeable {
    
    public abstract int read() throws IOException;
    
    // ...
}
```
这个方法会读取输入流的下一个字节，并返回字节表示的 int 值（0~255），返回 -1 表示已读到末尾。由于它是抽象方法，所以具体的逻辑交由子类实现。

上图中，左边的三个类 FileInputStream、ByteArrayInputStream、ServletInputStream 是 InputStream 的三个子类，对应上文例子中实现了 IHouse 接口的 House。

右下角的三个类 BufferedInputStream、DataInputStream、CheckedInputStream 是三个具体的装饰者类，他们都为 InputStream 增强了原有功能或添加了新功能。

FilterInputStream 是所有装饰类的父类，它没有实现具体的功能，仅用来包装了一下 InputStream：

```Java
Public class FilterInputStream extends InputStream {
    Protected volatile InputStream in;
    
    protected FilterInputStream(InputStream in) {
        this.in = in;
    }

    public int read() throws IOException {
        return in.read();
    }
    
    //...
}
```
我们以 BufferedInputStream 为例。原有的 InputStream 读取文件时，是一个字节一个字节的读取的，这种方式的执行效率并不高，所以我们可以设立一个缓冲区，先将内容读取到缓冲区中，缓冲区读满后，将内容从缓冲区中取出来，这样就变成了一段一段的读取，用内存换取效率。BufferedInputStream 就是用来做这个的。它继承自 FilterInputStream：

```Java
Public class BufferedInputStream extends FilterInputStream {
    Private static final int DEFAULT_BUFFER_SIZE = 8192;
    Protected volatile byte buf[];

    public BufferedInputStream(InputStream in) {
        this(in, DEFAULT_BUFFER_SIZE);
    }

    public BufferedInputStream(InputStream in, int size) {
        super(in);
        if (size <= 0) {
            throw new IllegalArgumentException("Buffer size <= 0");
        }
        buf = new byte[size];
    }
    
    //...
}
```
我们先来看它的构造方法，在构造方法中，新建了一个 byte[] 作为缓冲区，从源码中我们看到，Java 默认设置的缓冲区大小为 8192 byte，也就是 8 KB。

然后我们来查看 read 方法：

```Java
Public class BufferedInputStream extends FilterInputStream {
    //...

    public synchronized int read() throws IOException {
        if (pos >= count) {
            fill();
            if (pos >= count)
                return -1;
        }
        return getBufIfOpen()[pos++] & 0xff;
    }

    private void fill() throws IOException {
        // 往缓冲区内填充读取内容的过程
        //...
    }
}
```
在 read 方法中，调用了 fill 方法，fill 方法的作用就是往缓冲区中填充读取的内容。这样就实现了增强原有的功能。

在源码中我们发现，BufferedInputStream 没有添加 InputStream 中没有的方法，所以 BufferedInputStream 使用的是透明的装饰模式。

DataInputStream 用于更加方便的读取 int、double 等内容，观察 DataInputStream 的源码可以发现，DataInputStream 中新增了 readInt、readLong 等方法，所以 DataInputStream 使用的是半透明装饰模式。

理解了 InputStream 后，再看一下 OutputStream 的继承关系，相信大家一眼就能看出各个类的作用了：

![[Pasted image 20240104172915.png]]

这就是装饰模式，注意不要和适配器模式混淆了。两者在使用时都是包装一个类，但两者的区别其实也很明显：

- 纯粹的适配器模式仅用于改变接口，不改变其功能，部分情况下我们需要改变一点功能以适配新接口。但使用适配器模式时，接口一定会有一个回炉重造的过程。
- 装饰模式不改变原有的接口，仅用于增强原有功能或添加新功能，强调的是锦上添花。
掌握了装饰者模式之后，理解 Java I/O 的框架设计就非常容易了。但对于不理解装饰模式的人来说，各种各样相似的 InputStream 非常容易让开发者感到困惑。这一点正是装饰模式的缺点：容易造成程序中有大量相似的类。虽然这更像是开发者的缺点，我们应该做的是提高自己的技术，掌握了这个设计模式之后它就是我们的一把利器。现在我们再看到 I/O 不同的 InputStream 装饰类，**只需要关注它增强了什么功能或添加了什么功能即可**。