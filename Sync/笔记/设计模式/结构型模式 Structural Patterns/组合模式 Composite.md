上文说到，桥接模式用于将同等级的接口互相组合，那么组合模式和桥接模式有什么共同点吗？

事实上组合模式和桥接模式的组合完全不一样。组合模式用于整体与部分的结构，当整体与部分有相似的结构，在操作时可以被一致对待时，就可以使用组合模式。例如：

- 文件夹和子文件夹的关系：文件夹中可以存放文件，也可以新建文件夹，子文件夹也一样。
- 总公司子公司的关系：总公司可以设立部门，也可以设立分公司，子公司也一样。
- 树枝和分树枝的关系：树枝可以长出叶子，也可以长出树枝，分树枝也一样。
在这些关系中，虽然整体包含了部分，但无论整体或部分，都具有一致的行为。

> 组合模式：又叫部分整体模式，是用于把一组相似的对象当作一个单一的对象。组合模式依据树形结构来组合对象，用来表示部分以及整体层次。这种类型的设计模式属于结构型模式，它创建了对象组的树形结构。

考虑这样一个实际应用：设计一个公司的人员分布结构，结构如下图所示。

![[Pasted image 20240104123549.png]]

我们注意到人员结构中有两种结构，一是管理者，如老板，PM，CFO，CTO，二是职员。其中有的管理者不仅仅要管理职员，还会管理其他的管理者。这就是一个典型的整体与部分的结构。

### 不使用组合模式的设计方案
要描述这样的结构，我们很容易想到以下设计方案：

新建管理者类：

```Java
Public class Manager {
    // 职位
    Private String position;
    // 工作内容
    Private String job;
    // 管理的管理者
    private List<Manager> managers = new ArrayList<>();
    // 管理的职员
    private List<Employee> employees = new ArrayList<>();

    Public Manager (String position, String job) {
        This. Position = position;
        This. Job = job;
    }
    
    Public void addManager (Manager manager) {
        Managers.Add (manager);
    }

    Public void removeManager (Manager manager) {
        Managers.Remove (manager);
    }

    Public void addEmployee (Employee employee) {
        Employees.Add (employee);
    }

    Public void removeEmployee (Employee employee) {
        Employees.Remove (employee);
    }

    // 做自己的本职工作
    Public void work () {
        System.Out.Println ("我是" + position + "，我正在" + job);
    }
    
    // 检查下属
    Public void check () {
        Work ();
        For (Employee employee : employees) {
            Employee.Work ();
        }
        For (Manager manager : managers) {
            Manager.Check ();
        }
    }
}
```

新建职员类：

```Java
Public class Employee {
    // 职位
    Private String position;
    // 工作内容
    Private String job;

    Public Employee (String position, String job) {
        This. Position = position;
        This. Job = job;
    }

    // 做自己的本职工作
    Public void work () {
        System.Out.Println ("我是" + position + "，我正在" + job);
    }
}
```

客户端建立人员结构关系：

```Java
Public class Client {
    
    @Test
    Public void test () {
        Manager boss = new Manager ("老板", "唱怒放的生命");
        Employee HR = new Employee ("人力资源", "聊微信");
        Manager PM = new Manager ("产品经理", "不知道干啥");
        Manager CFO = new Manager ("财务主管", "看剧");
        Manager CTO = new Manager ("技术主管", "划水");
        Employee UI = new Employee ("设计师", "画画");
        Employee operator = new Employee ("运营人员", "兼职客服");
        Employee webProgrammer = new Employee ("程序员", "学习设计模式");
        Employee backgroundProgrammer = new Employee ("后台程序员", "CRUD");
        Employee accountant = new Employee ("会计", "背九九乘法表");
        Employee clerk = new Employee ("文员", "给老板递麦克风");
        Boss.AddEmployee (HR);
        Boss.AddManager (PM);
        Boss.AddManager (CFO);
        PM.AddEmployee (UI);
        PM.AddManager (CTO);
        PM.AddEmployee (operator);
        CTO.AddEmployee (webProgrammer);
        CTO.AddEmployee (backgroundProgrammer);
        CFO.AddEmployee (accountant);
        CFO.AddEmployee (clerk);

        Boss.Check ();
    }
}
```

运行测试方法，输出如下（为方便查看，笔者添加了缩进）：

```
我是老板，我正在唱怒放的生命
	我是人力资源，我正在聊微信
	我是产品经理，我正在不知道干啥
		我是设计师，我正在画画
		我是运营人员，我正在兼职客服
		我是技术主管，我正在划水
			我是程序员，我正在学习设计模式
			我是后台程序员，我正在 CRUD
	我是财务主管，我正在看剧
		我是会计，我正在背九九乘法表
		我是文员，我正在给老板递麦克风
```

这样我们就设计出了公司的结构，但是这样的设计有两个弊端：

- Name 字段，job 字段，work 方法重复了。
- 管理者对其管理的管理者和职员需要区别对待。

关于第一个弊端，虽然这里为了讲解，只有两个字段和一个方法重复，实际工作中这样的整体部分结构会有相当多的重复。比如此例中还可能有工号、年龄等字段，领取工资、上下班打卡、开各种无聊的会等方法。

大量的重复显然是很丑陋的代码，分析一下可以发现， Manager 类只比 Employee 类多一个管理人员的列表字段，多几个增加 / 移除人员的方法，其他的字段和方法全都是一样的。

有读者应该会想到：我们可以将重复的字段和方法提取到一个工具类中，让 Employee 和 Manager 都去调用此工具类，就可以消除重复了。

这样固然可行，但属于 Employee 和 Manager 类自己的东西却要通过其他类调用，并不利于程序的高内聚。

关于第二个弊端，此方案无法解决，此方案中 Employee 和 Manager 类完全是两个不同的对象，两者的相似性被忽略了。

所以我们有更好的设计方案，那就是组合模式！

### 使用组合模式的设计方案

组合模式最主要的功能就是让用户可以一致对待整体和部分结构，将两者都作为一个相同的组件，所以我们先新建一个抽象的组件类：

```Java
Public abstract class Component {
    // 职位
    Private String position;
    // 工作内容
    Private String job;

    Public Component (String position, String job) {
        This. Position = position;
        This. Job = job;
    }

    // 做自己的本职工作
    Public void work () {
        System.Out.Println ("我是" + position + "，我正在" + job);
    }

    Abstract void addComponent (Component component);

    Abstract void removeComponent (Component component);

    Abstract void check ();
}
```

管理者继承自此抽象类：

```Java
Public class Manager extends Component {
    // 管理的组件
    private List<Component> components = new ArrayList<>();

    Public Manager (String position, String job) {
        Super (position, job);
    }

    @Override
    Public void addComponent (Component component) {
        Components.Add (component);
    }

    @Override
    Void removeComponent (Component component) {
        Components.Remove (component);
    }

    // 检查下属
    @Override
    Public void check () {
        Work ();
        For (Component component : components) {
            Component.Check ();
        }
    }
}
```

职员同样继承自此抽象类：

```Java
Public class Employee extends Component {

    Public Employee (String position, String job) {
        Super (position, job);
    }

    @Override
    Void addComponent (Component component) {
        System.Out.Println ("职员没有管理权限");
    }

    @Override
    Void removeComponent (Component component) {
        System.Out.Println ("职员没有管理权限");
    }

    @Override
    Void check () {
        Work ();
    }
}
```

修改客户端如下：

```Java
Public class Client {

    @Test
    Public void test (){
        Component boss = new Manager ("老板", "唱怒放的生命");
        Component HR = new Employee ("人力资源", "聊微信");
        Component PM = new Manager ("产品经理", "不知道干啥");
        Component CFO = new Manager ("财务主管", "看剧");
        Component CTO = new Manager ("技术主管", "划水");
        Component UI = new Employee ("设计师", "画画");
        Component operator = new Employee ("运营人员", "兼职客服");
        Component webProgrammer = new Employee ("程序员", "学习设计模式");
        Component backgroundProgrammer = new Employee ("后台程序员", "CRUD");
        Component accountant = new Employee ("会计", "背九九乘法表");
        Component clerk = new Employee ("文员", "给老板递麦克风");
        Boss.AddComponent (HR);
        Boss.AddComponent (PM);
        Boss.AddComponent (CFO);
        PM.AddComponent (UI);
        PM.AddComponent (CTO);
        PM.AddComponent (operator);
        CTO.AddComponent (webProgrammer);
        CTO.AddComponent (backgroundProgrammer);
        CFO.AddComponent (accountant);
        CFO.AddComponent (clerk);

        Boss.Check ();
    }
}
```

运行测试方法，输出结果与之前的结果一模一样。

可以看到，使用组合模式后，我们解决了之前的两个弊端。一是将共有的字段与方法移到了父类中，消除了重复，并且在客户端中，可以一致对待 Manager 和 Employee 类：

- Manager 类和 Employee 类统一声明为 Component 对象
- 统一调用 Component 对象的 addComponent 方法添加子对象即可。
### 组合模式中的安全方式与透明方式
读者可能已经注意到了，Employee 类虽然继承了父类的 addComponent 和 removeComponent 方法，但是仅仅提供了一个空实现，因为 Employee 类是不支持添加和移除组件的。这样是否违背了接口隔离原则呢？

> 接口隔离原则：客户端不应依赖它不需要的接口。如果一个接口在实现时，部分方法由于冗余被客户端空实现，则应该将接口拆分，让实现类只需依赖自己需要的接口方法。

答案是肯定的，这样确实违背了接口隔离原则。这种方式在组合模式中被称作透明方式.

> 透明方式：在 Component 中声明所有管理子对象的方法，包括 add 、remove 等，这样继承自 Component 的子类都具备了 add、remove 方法。对于外界来说叶节点和枝节点是透明的，它们具备完全一致的接口。

这种方式有它的优点：让 Manager 类和 Employee 类具备完全一致的行为接口，调用者可以一致对待它们。

但它的缺点也显而易见：Employee 类并不支持管理子对象，不仅违背了接口隔离原则，而且客户端可以用 Employee 类调用 addComponent 和 removeComponent 方法，导致程序出错，所以这种方式是不安全的。

那么我们可不可以将 addComponent 和 removeComponent 方法移到 Manager 子类中去单独实现，让 Employee 不再实现这两个方法呢？我们来尝试一下。

将抽象类修改为：

```Java
Public abstract class Component {
    // 职位
    Private String position;
    // 工作内容
    Private String job;

    Public Component (String position, String job) {
        This. Position = position;
        This. Job = job;
    }

    // 做自己的本职工作
    Public void work () {
        System.Out.Println ("我是" + position + "，我正在" + job);
    }

    Abstract void check ();
}
```

可以看到，我们在父类中去掉了 addComponent 和 removeComponent 这两个抽象方法。

Manager 类修改为：

```Java
Public class Manager extends Component {
    // 管理的组件
    private List<Component> components = new ArrayList<>();

    Public Manager (String position, String job) {
        Super (position, job);
    }

    Public void addComponent (Component component) {
        Components.Add (component);
    }

    Void removeComponent (Component component) {
        Components.Remove (component);
    }

    // 检查下属
    @Override
    Public void check () {
        Work ();
        For (Component component : components) {
            Component.Check ();
        }
    }
}
```

Manager 类单独实现了 addComponent 和 removeComponent 这两个方法，去掉了 @Override 注解。

Employee 类修改为：

```Java
Public class Employee extends Component {

    Public Employee (String position, String job) {
        Super (position, job);
    }

    @Override
    Void check () {
        Work ();
    }
}
```

客户端建立人员结构关系：

```Java
Public class Client {

    @Test
    Public void test (){
        Manager boss = new Manager ("老板", "唱怒放的生命");
        Employee HR = new Employee ("人力资源", "聊微信");
        Manager PM = new Manager ("产品经理", "不知道干啥");
        Manager CFO = new Manager ("财务主管", "看剧");
        Manager CTO = new Manager ("技术主管", "划水");
        Employee UI = new Employee ("设计师", "画画");
        Employee operator = new Employee ("运营人员", "兼职客服");
        Employee webProgrammer = new Employee ("程序员", "学习设计模式");
        Employee backgroundProgrammer = new Employee ("后台程序员", "CRUD");
        Employee accountant = new Employee ("会计", "背九九乘法表");
        Employee clerk = new Employee ("文员", "给老板递麦克风");
        Boss.AddComponent (HR);
        Boss.AddComponent (PM);
        Boss.AddComponent (CFO);
        PM.AddComponent (UI);
        PM.AddComponent (CTO);
        PM.AddComponent (operator);
        CTO.AddComponent (webProgrammer);
        CTO.AddComponent (backgroundProgrammer);
        CFO.AddComponent (accountant);
        CFO.AddComponent (clerk);

        Boss.Check ();
    }
}
```

运行程序，输出结果与之前一模一样。

这种方式在组合模式中称之为安全方式。

> 安全方式：在 Component 中不声明 add 和 remove 等管理子对象的方法，这样叶节点就无需实现它，只需在枝节点中实现管理子对象的方法即可。

安全方式遵循了接口隔离原则，但由于不够透明，Manager 和 Employee 类不具有相同的接口，在客户端中，我们无法将 Manager 和 Employee 统一声明为 Component 类了，必须要区别对待，带来了使用上的不方便。

安全方式和透明方式各有好处，在使用组合模式时，需要根据实际情况决定。但大多数使用组合模式的场景都是采用的透明方式，虽然它有点不安全，但是客户端无需做任何判断来区分是叶子结点还是枝节点，用起来是真香。

问：组合模式中的安全方式与透明方式有什么区别？

答案：透明方式：在 Component 中声明所有管理子对象的方法，包括 add 、remove 等，这样继承自 Component 的子类都具备了 add、remove 方法。对于外界来说叶节点和枝节点是透明的，它们具备完全一致的接口。

安全方式：在 Component 中不声明 add 和 remove 等管理子对象的方法，这样叶节点就无需实现它，只需在枝节点中实现管理子对象的方法即可。