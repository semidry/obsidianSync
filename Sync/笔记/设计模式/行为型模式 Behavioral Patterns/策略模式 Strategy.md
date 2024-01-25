策略模式用一个成语就可以概括 —— 殊途同归。当我们做同一件事有多种方法时，就可以将每种方法封装起来，在不同的场景选择不同的策略，调用不同的方法。

> 策略模式（Strategy Pattern）：定义了一系列算法，并将每一个算法封装起来，而且使它们还可以相互替换。策略模式让算法独立于使用它的客户而独立变化。

我们以排序算法为例。排序算法有许多种，如冒泡排序、选择排序、插入排序，算法不同但目的相同，我们可以将其定义为不同的策略，让用户自由选择采用哪种策略完成排序。

首先定义排序算法接口：

```Java
Interface ISort {
    Void sort (int[] arr);
}
```
接口中只有一个 sort 方法，传入一个整型数组进行排序，所有的排序算法都实现此接口。

冒泡排序：

```Java
Class BubbleSort implements ISort{
    @Override
    Public void sort (int[] arr) {
        For (int i = 0; i < arr. Length - 1; i++) {
            For (int j = 0; j < arr. Length - 1 - i; j++) {
                If (arr[j] > arr[j + 1]) {
                    // 如果左边的数大于右边的数，则交换，保证右边的数字最大
                    Arr[j + 1] = arr[j + 1] + arr[j];
                    Arr[j] = arr[j + 1] - arr[j];
                    Arr[j + 1] = arr[j + 1] - arr[j];
                }
            }
        }
    }
}
```
选择排序：

```Java
Class SelectionSort implements ISort {
    @Override
    Public void sort (int[] arr) {
        Int minIndex;
        For (int i = 0; i < arr. Length - 1; i++) {
            MinIndex = i;
            For (int j = i + 1; j < arr. Length; j++) {
                If (arr[minIndex] > arr[j]) {
                    // 记录最小值的下标
                    MinIndex = j;
                }
            }
            // 将最小元素交换至首位
            Int temp = arr[i];
            Arr[i] = arr[minIndex];
            Arr[minIndex] = temp;
        }
    }
}
```
插入排序：

```Java
Class InsertSort implements ISort {
    @Override
    Public void sort (int[] arr) {
        // 从第二个数开始，往前插入数字
        For (int i = 1; i < arr. Length; i++) {
            Int currentNumber = arr[i];
            Int j = i - 1;
            // 寻找插入位置的过程中，不断地将比 currentNumber 大的数字向后挪
            While (j >= 0 && currentNumber < arr[j]) {
                Arr[j + 1] = arr[j];
                J--;
            }
            // 两种情况会跳出循环：1. 遇到一个小于或等于 currentNumber 的数字，跳出循环，currentNumber 就坐到它后面。
            // 2. 已经走到数列头部，仍然没有遇到小于或等于 currentNumber 的数字，也会跳出循环，此时 j 等于 -1，currentNumber 就坐到数列头部。
            Arr[j + 1] = currentNumber;
        }
    }
}
```
这三种都是基本的排序算法，就不再详细介绍了。接下来我们需要创建一个环境类，将每种算法都作为一种策略封装起来，客户端将通过此环境类选择不同的算法完成排序。

```Java
Class Sort implements ISort {

    private ISort sort;

    Sort(ISort sort) {
        this.sort = sort;
    }

    @Override
    public void sort(int[] arr) {
        sort.sort(arr);
    }

    // 客户端通过此方法设置不同的策略
    public void setSort(ISort sort) {
        this.sort = sort;
    }
}
```
在此类中，我们保存了一个 ISort 接口的实现对象，在构造方法中，将其初始值传递进来，排序时调用此对象的 sort 方法即可完成排序。

我们也可以为 ISort 对象设定一个默认值，客户端如果没有特殊需求，直接使用默认的排序策略即可。

SetSort 方法就是用来选择不同的排序策略的，客户端调用如下：

```Java
Public class Client {
    @Test
    Public void test () {
        Int[] arr = new int[]{6, 1, 2, 3, 5, 4};
        Sort sort = new Sort (new BubbleSort ());
        // 这里可以选择不同的策略完成排序
        // sort.SetSort (new InsertSort ());
        // sort.SetSort (new SelectionSort ());
        Sort.Sort (arr);
        // 输出 [1, 2, 3, 4, 5, 6]
        System.Out.Println (Arrays.ToString (arr));
    }
}
```
这就是基本的策略模式，通过策略模式我们可以为同一个需求选择不同的算法，以应付不同的场景。比如我们知道冒泡排序和插入排序是稳定的，而选择排序是不稳定的，当我们需要保证排序的稳定性就可以采用冒泡排序和插入排序，不需要保证排序的稳定性时可以采用选择排序。

策略模式还可以应用在图片缓存中，当我们开发一个图片缓存框架时，可以通过提供不同的策略类，让用户根据需要选择缓存解码后的图片、缓存未经解码的数据或者不缓存任何内容。在一些开源的图片加载框架中，就采用了这种设计。

策略模式扩展性和灵活性都相当不错。当有新的策略时，只需要增加一个策略类；要修改某个策略时，只需要更改具体的策略类，其他地方的代码都无需做任何调整。

但现在这样的策略模式还有一个弊端，如本系列第一篇文章中的工厂模式所言：每 new 一个对象，相当于调用者多知道了一个类，增加了类与类之间的联系，不利于程序的松耦合。

所以使用策略模式时，更好的做法是与工厂模式结合，将不同的策略对象封装到工厂类中，用户只需要传递不同的策略类型，然后从工厂中拿到对应的策略对象即可。接下来我们就来一起实现这种工厂模式与策略模式结合的混合模式。

创建排序策略枚举类：

```Java
Enum SortStrategy {
    BUBBLE_SORT,
    SELECTION_SORT,
    INSERT_SORT
}
```
在 Sort 类中使用简单工厂模式：

```Java
Class Sort implements ISort {

    private ISort sort;

    Sort(SortStrategy strategy) {
        setStrategy(strategy);
    }

    @Override
    public void sort(int[] arr) {
        sort.sort(arr);
    }

    // 客户端通过此方法设置不同的策略
    public void setStrategy(SortStrategy strategy) {
        switch (strategy) {
            case BUBBLE_SORT:
                sort = new BubbleSort();
                break;
            case SELECTION_SORT:
                sort = new SelectionSort();
                break;
            case INSERT_SORT:
                sort = new InsertSort();
                break;
            default:
                throw new IllegalArgumentException("There's no such strategy yet.");
        }
    }
}
```
利用简单工厂模式，我们将创建策略类的职责移到了 Sort 类中。如此一来，客户端只需要和 Sort 类打交道，通过 SortStrategy 选择不同的排序策略即可。

客户端：

```Java
Public class Client {
    @Test
    Public void test () {
        Int[] arr = new int[]{6, 1, 2, 3, 5, 4};
        Sort sort = new Sort (SortStrategy. BUBBLE_SORT);
        // 可以通过选择不同的策略完成排序
        // sort.SetStrategy (SortStrategy. SELECTION_SORT);
        // sort.SetStrategy (SortStrategy. INSERT_SORT);
        Sort.Sort (arr);
        // 输出 [1, 2, 3, 4, 5, 6]
        System.Out.Println (Arrays.ToString (arr));
    }
}
```
通过简单工厂模式与策略模式的结合，我们最大化地减轻了客户端的压力。这是我们第一次用到混合模式，但实际开发中会遇到非常多的混合模式，学习设计模式的过程只能帮助我们各个击破，真正融会贯通还需要在实际开发中多加操练。

需要注意的是，策略模式与状态模式非常类似，甚至他们的 UML 类图都是一模一样的。两者都是采用一个变量来控制程序的行为。策略模式通过不同的策略执行不同的行为，状态模式通过不同的状态值执行不同的行为。两者的代码很类似，他们的区别主要在于程序的目的不同。

- 使用策略模式时，程序只需选择一种策略就可以完成某件事。也就是说每个策略类都是完整的，都能独立完成这件事情，如上文所言，强调的是殊途同归。
- 使用状态模式时，程序需要在不同的状态下不断切换才能完成某件事，每个状态类只能完成这件事的一部分，需要所有的状态类组合起来才能完整的完成这件事，强调的是随势而动。