设想一个场景：我们有一个类中存在一个列表。这个列表需要提供给外部类访问，但我们不希望外部类修改其中的数据。

```Java
public class MyList {
    private List<String> data = Arrays.asList("a", "b", "c");
}
```
通常来说，将成员变量提供给外部类访问有两种方式：

- 将此列表设置为 public 变量；
- 添加 getData() 方法，返回此列表。

但这两种方式都有一个致命的缺点，它们无法保证外部类不修改其中的数据。外部类拿到 data 对象后，可以随意修改列表内部的元素，这会造成极大的安全隐患。

那么有什么更好的方式吗？使得外部类只能读取此列表中的数据，无法修改其中的任何数据，保证其安全性。

分析可知，我们可以通过提供两个方法实现此效果：

- 提供一个 String next() 方法，使得外部类可以按照次序，一条一条的读取数据；
- 提供一个 boolean hasNext() 方法，告知外部类是否还有下一条数据。

代码实现如下：

```Java
public class MyList {
    private List<String> data = Arrays.asList("a", "b", "c");
    private int index = 0;

    public String next() {
        // 返回数据后，将 index 加 1，使得下次访问时返回下一条数据
        return data.get(index++);
    }

    public boolean hasNext() {
        return index < data.size();
    }
}
```
客户端就可以使用一个 while 循环来访问此列表了：

```Java
public class Client {
    @Test
    public void test() {
        MyList list = new MyList();
        // 输出：abc
        while (list.hasNext()) {
            System.out.print(list.next());
        }
    }
}
```
由于没有给外部类暴露 data 成员变量，所以我们可以保证数据是安全的。

但这样的实现还有一个问题：当遍历完成后，hasNext() 方法就会一直返回 false，无法再一次遍历了，所以我们必须在一个合适的地方把 index 重置成 0。

在哪里重置比较合适呢？实际上，使用 next() 方法和 hasNext() 方法来遍历列表是一个完全通用的方法，我们可以为其创建一个接口，取名为 Iterator，Iterator 的意思是迭代器，迭代的意思是重复反馈，这里是指我们依次遍历列表中的元素。

```Java
public interface Iterator {
    boolean hasNext();
    String next();
}
```
然后在 MyList 类中，每次遍历时生成一个迭代器，将 index 变量放到迭代器中。由于每个迭代器都是新生成的，所以每次遍历时的 index 自然也就被重置成 0 了。代码如下：

```Java
public class MyList {
    private List<String> data = Arrays.asList("a", "b", "c");

    // 每次生成一个新的迭代器，用于遍历列表
    public Iterator iterator() {
        return new Itr();
    }

    private class Itr implements Iterator {
        private int index = 0;

        @Override
        public boolean hasNext() {
            return index < data.size();
        }

        @Override
        public String next() {
            return data.get(index++);
        }
    }
}
```
客户端访问此列表的代码修改如下：

```Java
public class Client {
    @Test
    public void test() {
        MyList list = new MyList();
        // 获取迭代器，用于遍历列表
        Iterator iterator = list.iterator();
        // 输出：abc
        while (iterator.hasNext()) {
            System.out.print(iterator.next());
        }
    }
}
```

![[1604309826-Szeuis-5.gif]]
这就是迭代器模式，《设计模式》一书中将其定义如下：

> 迭代器模式（Iterator Pattern）：提供一种方法访问一个容器对象中各个元素，而又不需暴露该对象的内部细节。

迭代器模式的核心就在于定义出 next() 方法和 hasNext() 方法，让外部类使用这两个方法来遍历列表，以达到隐藏列表内部细节的目的。

事实上，Java 已经为我们内置了 Iterator 接口，源码中使用了泛型使得此接口更加的通用：

```Java
public interface Iterator<E> {
    boolean hasNext();
    E next();
}
```
并且，本例中使用的迭代器模式是仿照 ArrayList 的源码实现的，ArrayList 源码中使用迭代器模式的部分代码如下：

```Java
public class ArrayList<E> {
    ...
    
    public Iterator<E> iterator() {
        return new Itr();
    }
    
    private class Itr implements Iterator<E> {
        protected int limit = ArrayList.this.size;
        int cursor;
        
        public boolean hasNext() {
            return cursor < limit;
        }

        public E next() {
            ...
        }
    }
}
```
我们平时常用的 for-each 循环，也是迭代器模式的一种应用。在 Java 中，只要实现了 Iterable 接口的类，都被视为可迭代访问的。Iterable 中的核心方法只有一个，也就是刚才我们在 MyList 类中实现过的用于获取迭代器的 iterator() 方法：

```Java
public interface Iterable<T> {
    Iterator<T> iterator();
    ...
}
```
只要我们将 MyList 类修改为继承此接口，便可以使用 for-each 来迭代访问其中的数据了：

```Java
public class MyList implements Iterable<String> {
    private List<String> data = Arrays.asList("a", "b", "c");

    @NonNull
    @Override
    public Iterator<String> iterator() {
        // 每次生成一个新的迭代器，用于遍历列表
        return new Itr();
    }

    private class Itr implements Iterator<String> {
        private int index = 0;

        @Override
        public boolean hasNext() {
            return index < data.size();
        }

        @Override
        public String next() {
            return data.get(index++);
        }
    }
}
```
客户端使用 for-each 访问：

```Java
public class Client {
    @Test
    public void test() {
        MyList list = new MyList();
        // 输出：abc
        for (String item : list) {
            System.out.print(item);
        }
    }
}
```
这就是迭代器模式。基本上每种语言都会在语言层面为所有列表提供迭代器，我们只需要直接拿来用即可，这是一个比较简单又很常用的设计模式。