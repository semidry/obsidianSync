# STL主要容器
## vector<元素类型>

- 用于需要快速定位（访问）任意位置上的元素
- 以及主要在元素序列的尾部增加/删除元素的场合。

在头文件`vector`中定义，用**动态数组实现。**

## list<元素类型>

- 用于经常在元素序列中任意位置上插入/删除元素的场合。

在头文件`list`中定义，用**双向链表**实现。

> 在C++11标准中增加了`forward_list`容器，本质上是一个**单向链表**，定义在头文件`forward_list`中。

## deque<元素类型>

- 用于主要在元素序列的两端增加/删除元素
- 以及需要快速定位（访问）任意位置上的元素的场合。

在头文件`deque`中定义，用**分段的连续空间结构**实现。

## stack<元素类型>

- 用于仅在元素序列的尾部增加/删除元素的场合。

在头文件`stack`中定义，可基于`deque`、`list`或`vector`来实现。

## queue<元素类型>

- 用于仅在元素序列的尾部增加、头部删除元素的场合。

在头文件`queue`中定义，可基于`deque`和`list`来实现。

## priority_queue<元素类型>

它与`queue`的操作类似，不同之处在于：每次增加/删除元素之后，它将对元素位置进行调整，使得头部元素总是最大的。也就是说，每次删除操作总是把最大（优先级最高）的元素去掉。

在头文件`queue`中定义，可基于`deque`和`vector`来实现。

## map<关键字类型，值类型> 和 multimap<关键字类型，值类型>

用于需要根据关键字来访问元素的场合。容器中每个元素是一个`pair`结构类型，该结构有两个成员：`first`和`second`，关键字对应`first`，值对应`second`，元素是根据其关键字排序的。

对于`map`，不同元素的关键字不能相同；

对于`multimap`，不同元素的关键字可以相同。

它们在头文件`map`中定义，常常用某种**二叉树**来实现。

> 有时候我们不需要排序，所以在C++11标准中新增加了`unordered_map`和`unordered_multimap`容器。

## set<元素类型> 和 multiset<元素类型>

它们分别是`map`和`multimap`的特例，每个元素只有关键字而没有值，或者说，关键字与值合一了。

在头文件`set`中定义。

> C++11标准中增加了`unordered_set`和`unordered_multiset`容器。

## basic_string<字符类型>

与`vector`类似，不同之处在于其元素为字符类型，并提供了一系列与**字符串**相关的操作。

`string`和`wstring`分别是它的两个实例：
- `basic_string<char>`
- `basic_string<wchar_t>`

在头文件`string`中定义。
## 举例：利用`map`实现一个简单的电话簿
```Cpp
#include <iostream>
#include <map>
#include <string>
using namespace std;
int main()
{
    map<string,int> phone_book; // 创建一个map类容器，用于存储电话号码簿
    
    // 创建电话簿
    phone_book["wang"] = 12345678; // 通过[]操作和关键字往容器中加入元素
    phone_book["li"] = 87654321;
    phone_book["zhang"] = 56781234;
    // ......  还可以添加更多的信息
    // 输出电话号码簿
    cout << "电话号码簿的信息如下：\n";
    for (pair<string, int> item: phone_book) 
    // C++11中引入的enhanced-for loop
        cout << item.first << ": " << item.second << endl; 
    // 输出元素的姓名和电话号码

    // 查找某个人的电话号码
    string name;
    cout << "请输入要查询号码的姓名：";
    cin >> name;
    map<string,int>::const_iterator it; // 创建一个不能修改所指向的元素的迭代器
    it = phone_book.find(name); // 查找关键字为name的容器元素
    if (it == phone_book.end()) // 判断是否找到
        cout << name << ": not found\n"; // 未找到
    else
        cout << it->first << ": " << it->second << endl; // 找到
    return 0;
}
```
# 迭代器
## 迭代器-Iterator
在STL中，迭代器是作为类模板来实现的（在头文件`iterator`中定义），它们可分为以下几种类型：
### 根据访问修改权限分类
#### 输出迭代器（output iterator，记为：**OutIt**）
- 可以修改它所指向的容器元素
- 间接访问操作（`*`）
- `++`操作
#### 输入迭代器（input iterator，记为：**InIt**）
- 只能读取它所指向的容器元素
- 间接访问操作（`*`）和元素成员间接访问（`->`）
- `++`、`!=`, `等于`操作。
### 根据迭代方式分类
#### 前向迭代器（forward iterator，记为：**FwdIt**）
- 可以读取/修改它所指向的容器元素
- 元素间接访问操作（`*`）和元素成员间接访问操作（`->`）
- `++`、`!=`, `等于`操作
#### 双向迭代器（bidirectional iterator，记为：**BidIt**）
- 可以读取/修改它所指向的容器元素
- 元素间接访问操作（`*`）和元素成员间接访问操作（`->`）
- `++`、`--`、`!=`, `等于`操作
#### 随机访问迭代器（random-access iterator，记为：**RanIt**）
- 可以读取/修改它所指向的容器元素
- 元素间接访问操作（`*`）、元素成员间接访问操作（`->`）和下标访问元素操作（`[]`）
- `++`、`--`、`+`、`-`、`+=`、`-=`、`!=`、`<`、`>`、`<=`、`>=`, `等于`操作
### 特殊迭代器
#### 反向迭代器（reverse iterator）
用于对容器元素从尾到头进行反向遍历，可以通过容器类的成员函数`rbegin`和`rend`可以获得容器的尾和首元素的反向迭代器。

需要注意的是，对反向迭代器，`++`操作是往容器首部移动，`--`操作是往容器尾部移动。

#### 插入迭代器（insert iterator）
用于在容器中指定位置插入元素，其中包括：
- `back_insert_iterator`（用于在尾部插入元素）
- `front_insert_iterator`（用于在首部插入元素）
- `insert_iterator`（用于在任意指定位置插入元素）
它们可以分别通过函数`back_inserter`、`front_inserter`和`inserter`来获得，函数的参数为容器。
## 各容器的迭代器类型
- 对于`vector`、`deque`以及`basic_string`容器类，与它们关联的迭代器类型为**随机访问迭代器（RanIt）**
- 对于`list`、`map/multimap`以及`set/multiset`容器类，与它们关联的迭代器类型为**双向迭代器（BidIt）**
- `queue`、`stack`和`priority_queue`容器类，不支持迭代器！
## 迭代器之间的相融关系
> 在需要箭头左边迭代器的地方可以用箭头右边的迭代器去替代。
![[Pasted image 20240102160854.png]]
## 举例：使用`list`和`iterator`求解约瑟夫问题
```CPP
#include <iostream>
#include <list>
using namespace std;
int main()
{ 
   int m,n; // m用于存储要报的数，n用于存储小孩个数
   cout << "请输入小孩的个数和要报的数：";
   cin >> n >> m;
   // 构建圈子
   list<int> children; // children是用于存储小孩编号的容器
   for (int i=0; i<n; i++) // 循环创建容器元素
      children.push_back(i); // 把i（小孩的编号）从容器尾部放入容器
   // 开始报数
   list<int>::iterator current; // current为指向容器元素的迭代器
   current = children.begin(); // current初始化成指向容器的第一个元素
   while (children.size() > 1) // 只要容器元素个数大于1，就执行循环
   {
      for (int count = 1; count < m; count++)  //报数，循环m-1次
      {
         current++; //current指向下一个元素
         // 如果current指向的是容器末尾，current指向第一个元素
         if (current == children.end()) current = children.begin();
       }
       // 循环结束时，current指向将要离开圈子的小孩
       current = children.erase(current);  // 小孩离开圈子，current指向下一个元素
       // 如果current指向的是容器末尾，current指向第一个元素
       if (current == children.end()) current = children.begin();
   } // 循环结束时，current指向容器中剩下的唯一的一个元素，即胜利者
   // 输出胜利者的编号
   cout << "The winner is No." << *current << "\n";
   return 0;
}
```
> 上面程序中的`list`也可以换成`vector`，但由于程序中**需要经常在容器的任意位置上删除元素**，而`list`容器的**双向链表**结构比较适合这个操作！

# 算法
## 算法与容器之间的关系
在STL中，不是把容器传给算法，而是把容器的某些迭代器传给它们，在算法中通过迭代器来访问和遍历相应容器中的元素。

这样做的好处是：使得**算法不依赖于具体的容器，提高了算法的通用性**。

> 虽然容器各不相同，但它们的迭代器往往具有相容关系，一个算法往往可以接受相容的多种迭代器。

## 算法接受的迭代器类型
一个算法能接收的迭代器的类型是通过**算法模板参数的名字**来体现的。例如：
```CPP
template <class InIt, class OutIt>
OutIt copy(InIt src_first, InIt src_last, OutIt dst_first) {...}
```
- `src_first`和`src_last`是输入迭代器，算法中只能读取它们指向的元素。
- `dst_first`是输出迭代器，算法中可以修改它指向的元素。
- 以上参数可以接受其它相容的迭代器。

## 算法的操作范围
用算法对容器中的元素进行操作时，大都需要用两个迭代器来指出要操作的元素的范围。

例如：

```CPP
void sort(RanIt first, RanIt last);
```
- `first`是第一个元素的位置
- `last`是最后一个元素的下一个位置

有些算法可以有多个操作范围，这时，除第一个范围外，其它范围可以不指定最后一个元素位置，它由第一个范围中元素的个数决定。例如：

```CPP
OutIt copy(InIt src_first, InIt src_last, OutIt dst_first);
```

一个操作范围的两个迭代器必须属于同一个容器，而不同操作范围的迭代器可以属于不同的容器。

## 算法的自定义操作条件
有些算法可以让使用者提供一个**函数**或**函数对象**来作为**自定义操作条件**（或称为**谓词**），其参数类型为相应容器的元素类型，返回值类型为bool。

自定义操作条件可分为：
- **Pred**：一元“谓词”，需要一个元素作为参数
- **BinPred**：二元“谓词”，需要两个元素作为参数

### 一元谓词举例
例如，对于下面的“**统计**”算法：

```cpp
size_t count_if(InIt first, InIt last, Pred cond);
```

可以有如下使用方式：

```cpp
#include <vector>
#include <algorithm>
#include <iostream>
using namespace std;

bool f(int x) { return x > 0; }

int main() 
{
    vector<int> v;
    ...... // 往容器中放了元素
    cout << count_if(v.begin(), v.end(), f); // 统计v中正数的个数
    return 0;
}
```

### 二元谓词举例
例如，对于下面的“**排序**”算法：
```cpp
void sort(RanIt first, RanIt last); // 按“<”排序
void sort(RanIt first, RanIt last, BinPred comp); // 按comp返回true规定的次序
```
可以有如下用法：
```cpp
#include <vector>
#include <algorithm>
using namespace std;

bool greater2(int x1, int x2) { return x1 > x2; }

int main()
{
    vector<int> v;
    ...... // 往容器中放了元素
    sort(v.begin(), v.end()); // 从小到大排序
    sort(v.begin(), v.end(), greater2); // 从大到小排序
    return 0;
}
```

## 算法的自定义操作
有些算法可以让使用者提供一个函数或函数对象作为**自定义操作**，其参数和返回值类型由相应的算法决定。

自定义操作可分为：
- **Op**或**Fun**：一元操作，需要一个参数
- **BinOp**或**BinFun**：二元操作，需要两个参数
### 一元操作举例

例如，对于下面的“元素遍历”算法：
```cpp
Fun for_each(InIt first, InIt last, Fun f);
```
可以有如下用法：
```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

void f(int x) { cout << ' ' << x; }

int main()
{
     vector<int> v;
     ...... // 往容器中放了元素
     for_each(v.begin(), v.end(), f); // 对v中的每个元素去调用函数f进行操作
     return 0;
}
```

### 二元操作举例
例如，对于下面的“累积”算法：
```CPP
T accumulate(InIt first, InIt last, T val); // 按“+”操作
T accumulate(InIt first, InIt last, T val, BinOp op); // 由op决定累积的含义
```
设元素为，$e_1,e_2,……,e_n$ ，算法返回$t_n$：

$$t_1=op(val,e_1),t_2=op(t_1,e_2),t_n=op(t_{n-1},e_{n-1})$$
可以有如下用法：
```cpp
#include <vector>
#include <numeric>
using namespace std;

int f1(int partial, int x) { return partial * x; }
int f2(int partial, int x) { return partial + x * x; }
double f3(double partial, int x) { return partial + 1.0 / x; }

int main
{
    vector<int> v;
    ...... // 往容器中放了元素
    
    int sum = accumulate(v.begin(), v.end(), 0); // 所有元素和
    int product = accumulate(v.begin(), v.end(), 1, f1); // 所有元素的乘积
    int sq_sum = accumulate(v.begin(), v.end(), 0, f2); // 所有元素平方和
    int rec_sum = accumulate(v.begin(), v.end(), 0.0, f3); // 元素倒数和
    
    return 0;
}
```

再例如，对于下面的元素“**变换/映射**”算法：
```cpp
OutIt transform(InIt src_first, InIt src_last, OutIt dst_first, Op f);
OutIt transform(InIt1 src_first1, InIt1 src_last1, InIt2 src_first2, OutIt dst_first, BinOp f);
```
可以有如下用法：
```CPP
#include <algorithm>
#include <vector>
using namespace std;

int f1(int x) { return x * x; }
int f2(int x1, int x2) { return x1 + x2; }

int main()
{
    vector<int> v1,v2,v3,v4;
    ...... // 往v1和v2容器中放了元素
    
    transform(v1.begin(),v1.end(),v3.begin(),f1); 
    // v3中的元素是v1相应元素的平方
    
    transform(v1.begin(),v1.end(),v2.begin(),v4.begin(),f2); 
    // v4中的元素是v1和v2相应元素的和
    
    return 0;
}
```

# # 容器(Container)
在这个章节里面，我们会先具体讲述C++STL中提供的各种常用容器，每个容器大致会包含如下内容：
- 基本概念
- 迭代器类型
- 数据结构
- 常用API接口

**如何选取合适的容器**
根据前面的叙述，容器分为序列容器和容器适配器两种，其选择的主要流程如下：

*序列容器选择流程图*
![[Pasted image 20240107233110.png]]
*容器适配器选择流程图*
![[Pasted image 20240107233224.png]]

## string - 字符串
### string 和 C风格字符 串对比
- `char*`是一个指针，`string`是一个类
    `string`封装了`char*`，管理这个字符串，是一个`char*`型的容器。
- `string` 封装了很多实用的成员方法
    查找`find`，拷贝`copy`，删除`erase`，替换`replace`，插入`insert`......
- 不用考虑内存释放和越界
    `string`管理`char*`所分配的内存，每一次`string`的复制/赋值，取值都由`string`类负责维护，不用担心复制越界和取值越界等。

> `string` 本质上是一个动态的char数组。

### string 容器常用操作
#### string 构造函数
```cpp
string();
// 默认构造函数，创建一个空的字符串
string(const string& str);
// 拷贝构造函数，使用一个string对象初始化另一个string对象
string(const char* s);
// 含参构造函数，使用C风格字符串初始化
string(int n, char c);
// p含参构造函数，使用n个字符c初始化
```
### string 基本赋值操作
#### = 赋值操作符
```cpp
string& operator=(const char* s);
// C风格字符串赋值给当前的字符串
string& operator=(const string& s);
// 把字符串s赋给当前的字符串
string& operator=(const char c);
//字符赋值给当前的字符串
```
#### `assign` 成员函数
```cpp
string& assign(const char* s); 
// C风格字符串赋值给当前的字符串
string& assign(const char* s, int n); 
// 把C风格字符串s的前n个字符赋给当前的字符串
string& assign(const string& s); 
// 把字符串s赋给当前字符串
string& assign(int n, char c); 
// 把n个字符c赋给当前的字符串
string& assign(const string& s, int start, int n); 
// 将字符串s中从start开始的n个字符赋值给当前字符串
```
### string 存取字符操作
#### `[]`下标获取操作符
```cpp
char& operator[](int n); 
// 通过[]下标方式获取字符
```
使用下标操作符获取字符时，如果下标越界，程序将会强制终止。
#### `at`成员函数
```cpp
char& at(int n); 
// 通过at方法获取字符
```
使用at方法获取字符时，如果下标越界，at方法内部会抛出异常（`exception`），可以使用`try-catch`捕获并处理该异常。示例如下：
```cpp
#include <stdexception> 
//标准异常头文件
#incldue <iostream>
using namespace std;

int main()
{
    string s = "hello world";
    try
    {
        //s[100]不会抛出异常，程序会直接挂掉
        s.at(100);
    }
    catch (out_of_range& e) 
        //如果不熟悉异常类型，可以使用多态特性， catch(exception& e)。
    {
        cout << e.what() << endl; 
        //打印异常信息
    }
    return 0;
}
```
> 关于 C++的异常处理用法可以查看[相关教程](https://www.runoob.com/cplusplus/cpp-exceptions-handling.html)

### string 拼接操作
#### `+=`复合操作符
```cpp
string& operator+=(const string& str); 
// 将字符串str追加到当前字符串末尾
string& operator+=(const char* str); 
// 将C风格字符数组追加到当前字符串末尾
string& operator+=(const char c); 
// 将字符c追加到当前字符串末尾
/* 上述操作重载了复合操作符+= */
```
#### `append`成员函数
```cpp
string& append(const char* s); 
// 把C风格字符数组s连接到当前字符串结尾
string& append(const char* s, int n); 
// 把C风格字符数组s的前n个字符连接到当前字符串结尾
string& append(const string &s); 
// 将字符串s追加到当前字符串末尾
string& append(const string&s, int pos, int n); 
// 把字符串s中从pos开始的n个字符连接到当前字符串结尾
string& append(int n, char c); 
// 在当前字符串结尾添加n个字符c
```
### string 查找和替换
#### `find`成员函数
```cpp
int find(const string& str, int pos = 0) const; 
// 查找str在当前字符串中第一次出现的位置，从pos开始查找，pos默认为0
int find(const char* s, int n = 0) const; 
// 查找C风格字符串s在当前字符串中第一次出现的位置，从pos开始查找，pos默认为0
int find(const char* s, int pos, int n) const; 
// 从pos位置查找s的前n个字符在当前字符串中第一次出现的位置
int find(const char c, int pos = 0) const; 
// 查找字符c第一次出现的位置，从pos开始查找，pos默认为0
```
当查找失败时，`find`方法会返回`-1`，`-1`已经被封装为string的静态成员常量`string::npos`。
```cpp
static const size_t nops = -1;
```
#### `rfind`成员函数
```cpp
int rfind(const string& str, int pos = npos) const; 
// 从pos开始向左查找最后一次出现的位置，pos默认为npos
int rfind(const char* s, int pos = npos) const; 
// 查找s最后一次出现的位置，从pos开始向左查找，pos默认为npos
int rfind(const char* s, int pos, int n) const; 
// 从pos开始向左查找s的前n个字符最后一次出现的位置
int rfind(const char c, int pos = npos) const; 
// 查找字符c最后一次出现的位置
```
> `find` 方法通常查找字串第一次出现的位置，而 `rfind` 方法通常查找字串最后一次出现的位置。
> `rfind(str, pos)`的实际的开始位置是`pos + str.size()`，即从该位置开始（不包括该位置字符）向前寻找匹配项，如果有则返回字符串位置，如果没有返回`string::npos`。
> `-1`其实是`size_t`类的最大值（学过补码的同学应该不难理解），所以`string::npos`还可以表示“直到字符串结束”，这样的话rfind中pos的默认参数是不是就不难理解啦？

#### `replace`成员函数
```cpp
string& replace(int pos, int n, const string& str); 
// 替换从pos开始n个字符为字符串s
string& replace(int pos, int n, const char* s);
// 替换从pos开始的n个字符为字符串s
```
`compare`函数依据字典序比较，在当前字符串比给定字符串小时返回`-1`，在当前字符串比给定字符串大时返回`1`，相等时返回`0`。
#### 比较操作符
```cpp
bool operator<(const string& str) const;
bool operator<(const char* str) const;
bool operator<=(const string& str) const;
bool operator<=(const char* str) const;
bool operator==(const string& str) const;
bool operator==(const char* str) const;
bool operator>(const string& str) const;
bool operator>(const char* str) const;
bool operator>=(const string& str) const;
bool operator>=(const char* str) const;
bool operator!=(const string& str) const;
bool operator!=(const char* str) const;
```
`string`类重载了所有的比较操作符，其含义与比较操作符本身的含义相同。
### string 子串
#### `substr`成员函数
```cpp
string substr(int pos = 0, int n = npos) const;
// 返回由pos开始的n个字符组成的字符串
```
### string 插入和删除操作
#### **`insert`** 成员函数
```cpp
string& insert(int pos, const char* s); // 在pos位置插入C风格字符数组
string& insert(int pos, const string& str); // 在pos位置插入字符串str
string& insert(int pos, int n, char c); // 在pos位置插入n个字符c
```
> 返回值是插入后的字符串结果，`erase` 同理。其实就是指向自身的一个引用。

#### **`erase`** 成员函数
```cpp
string& erase(int pos, int n = npos); // 删除从pos位置开始的n个字符
```
> 默认一直删除到末尾。

### `string` 和 `C-Style` 字符串的转换
#### **`string`** **转** **`const char*`**
```cpp
string str = "demo";
const char* cstr = str.c_str();
```
#### **`const char*`** **转** **`string`**
```cpp
const char* cstr = "demo";
string str(cstr); // 本质上其实是一个有参构造
```
> 在 c++中存在一个从 `const char*` 到 `string` 类的隐式类型转换，但却不存在从一个 `string` 对象到 `const char*` 的自动类型转换。对于 `string` 类型的字符串，可以通过 `c_str()` 方法返回 `string` 对象对应的 `const char*` 字符数组。
> 
> 比如说，当一个函数的参数是`string`时，我们可以传入`const char*`作为参数，编译器会自动将其转化为`string`，但这个过程不可逆。
> 
> 为了修改string字符串的内容，下标操作符`[]`和`at`都会返回字符串的引用，但当字符串的内存被重新分配之后，可能发生错误。（结合字符串的本质是动态字符数组的封装便不难理解了）

### 和 string 相关的全局函数
> 注：有的可能需要C++11标准。

#### 大小写转换
```cpp
#include <cctype>
// 在iostream中已经包含了这个头文件，如果没有包含iostream头文件，则需手动包含cctype

int tolower(int c); // 如果字符c是大写字母，则返回其小写形式，否则返回本身
int toupper(int c); // 如果字符c是小写字母，则返回其大写形式，否则返回本身

/**
  * C语言中字符就是整数，这两个函数是从C库沿袭过来的，保留了C的风格
*/
```
如果想要对整个字符串进行大小写转化，则需要使用一个`for`循环，或者配合和`algorithm`库来实现。例如：
```cpp
#include <string>
#include <cctype>
#include <algorithm>

string str = "Hello, World!";
transform(str.begin(), str.end(), str.begin(), toupper); //字符串转大写
transform(str.begin(), str.end(), str.begin(), tolower); //字符串转小写
```
#### 字符串和数字的转换
**`int`****/****`double`** **转** **`string`**
> c++11标准新增了全局函数`std::to_string`，十分强大，可以将很多类型变成`string`类型。
```cpp
#include <string>
using namespace std;

/** 带符号整数转换成字符串 */
string to_string(int val);
string to_string(long val);
string to_string(long long val);

/** 无符号整数转换成字符串 */
string to_string(unsigned val);
string to_string(unsigned long val);
string to_string(unsigned long long val);

/** 实数转换成字符串 */
string to_string(float val);
string to_string(double val);
string to_string(long double val);
```
#### **`string`** **转** **`double`** **/** **`int`**
```cpp
#include <cstdlib>
#include <string>
using namespace std;

/** 字符串转带符号整数 */
int stoi(const string& str, size_t* idx = 0, int base = 10);
long stol(const string& str, size_t* idx = 0, int base = 10);
long long stoll(const string& str, size_t* idx = 0, int base = 10);

/**
  * 1. idx返回字符串中第一个非数字的位置，即数值部分的结束位置
  * 2. base为进制
  * 3. 该组函数会自动保留负号和自动去掉前导0
 */

/** 字符串转无符号整数 */
unsigned long stoul(const string& str, size_t* idx = 0, int base = 10);
unsigned long long stoull(const string& str, size_t* idx = 0, int base = 10);

/** 字符串转实数 */
float stof(const string& str, size_t* idx = 0);
double stod(const string& str, size_t* idx = 0);
long double stold(const string& str, size_t* idx = 0);
```
与之类似的在同一个库里的还有一组基于字符数组的函数如下。
```cpp
// 'a' means array, since it is array-based. 

int atoi(const char* str); // 'i' means  int
long atol(const char* str); // 'l' means long
long long atoll(const char* str); // 'll' means long long

double atof(const char* str); // 'f' means double
```
> 至此，读者应当详细了解了C++STL中string容器的各种用法以及其他一些字符串处理的常用函数。可能量有些大，无法一下子记住，可以暂时留个印象，待到使用时多翻一翻，慢慢就记住了。
