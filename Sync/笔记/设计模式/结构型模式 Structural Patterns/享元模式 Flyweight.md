享元模式体现的是程序可复用的特点，为了节约宝贵的内存，程序应该尽可能地复用，就像《极限编程》作者 Kent 在书里说到的那样：Don't repeat yourself. 简单来说享元模式就是共享对象，提高复用性，官方的定义倒是显得文绉绉的：

> 享元模式：运用共享技术有效地支持大量细粒度对象的复用。系统只使用少量的对象，而这些对象都很相似，状态变化很小，可以实现对象的多次复用。由于享元模式要求能够共享的对象必须是细粒度对象，因此它又称为轻量级模式。

有个细节值得注意：有些对象本身不一样，但通过一点点变化后就可以复用，我们编程时可能稍不注意就会忘记复用这些对象。比如说伟大的超级玛丽，谁能想到草和云更改一下颜色就可以实现复用呢？还有里面的三种乌龟，换一个颜色、加一个装饰就变成了不同的怪。

在超级玛丽中，这样的细节还有很多，正是这些精湛的复用使得这一款红遍全球的游戏仅有 40 KB 大小。正是印证了那句名言：神在细节之中。

经典享元模式  
利用一个静态地 String 数组实现了一个只读 Map，而这个 String 数组同时也可被其他类使用，因而极大节省了内存空间。
```java
public class Countries {
    public static final String[][] DATA = {
            {"CANADA", "Ottawa"}, {"UNITED STATES OF AMERICA", "Washington, D.C"},
            {"BRAZIL", "Brasilia"}, {"RUSSIA", "Moscow"},
            {"ITALY", "Rome"}, {"SPAIN", "Madrid"},
            {"CHINA", "Beijing"}, {"EGYPT", "Cairo"},
            {"JAPAN", "Tokyo"}, {"KOREA", "Seoul"},
            {"GERMANY", "Berlin"}, {"GREECE", "Athens"},
            {"FRANCE", "Paris"}, {"THE NETHERLANDS", "Amsterdam"}
    };

    // Use AbstractMap by implementing entrySet()
    private static class FlyweightMap extends AbstractMap<String,String> {
        // Use Entry by implementing getKey() getValue() setValue()
        private static class Entry implements Map.Entry<String,String> {
            int index;
            Entry(int index) { this.index = index; }
            public boolean equals(Object o) {
                if(o instanceof String)
                    return DATA[index][0].equals(o);
                return false;
            }
            public String getKey() { return DATA[index][0]; }
            public String getValue() { return DATA[index][1]; }
            public String setValue(String value) {
                throw new UnsupportedOperationException("Read Only!");
            }
            public int hashCode() {
                return DATA[index][0].hashCode();
            }
        }
        // Use AbstractSet by implementing size() & iterator
        static class EntrySet extends AbstractSet<Map.Entry<String,String>> {
            private int size;
            EntrySet(int size) {
                if(size < 0)
                    this.size = 0;
                else if(size > DATA.length) {
                    this.size = DATA.length;
                }else {
                    this.size = size;
                }
            }
            public int size() { return size; }
            private class Iter implements Iterator<Map.Entry<String,String>> {
                private Entry entry = new Entry(-1);
                public boolean hasNext() {
                    return entry.index < size - 1;
                }
                public Map.Entry<String,String> next() {
                    entry.index++;
                    return entry;
                }
                public void remove() {
                    throw new UnsupportedOperationException();
                }
            }
            public Iterator<Map.Entry<String,String>> iterator() {
                return new Iter();
            }
        }
        private static Set<Map.Entry<String,String>> entries = new EntrySet(DATA.length);
        public Set<Map.Entry<String, String>> entrySet() {
            return entries;
        }
    }
    // Create a partial map of 'size' countries
    static Map<String,String> select(final int size) {
        return new FlyweightMap() {
            public Set<Map.Entry<String,String>> entrySet(int size) {
                return new EntrySet(size);
            }
        };
    }
    static Map<String,String> map = new FlyweightMap();
    public static Map<String,String> capitals() {
        return map;
    }
    public static Map<String,String> capitals(int size) {
        return select(size);
    }
    static List<String> names = new ArrayList<>(map.keySet());
    public static List<String> names() { return names; }
    public static List<String> names(int size) {
        return new ArrayList<>(select(size).keySet());
    }
}
public class Countries {
    public static final String[][] DATA = {
            {"CANADA", "Ottawa"}, {"UNITED STATES OF AMERICA", "Washington, D.C"},
            {"BRAZIL", "Brasilia"}, {"RUSSIA", "Moscow"},
            {"ITALY", "Rome"}, {"SPAIN", "Madrid"},
            {"CHINA", "Beijing"}, {"EGYPT", "Cairo"},
            {"JAPAN", "Tokyo"}, {"KOREA", "Seoul"},
            {"GERMANY", "Berlin"}, {"GREECE", "Athens"},
            {"FRANCE", "Paris"}, {"THE NETHERLANDS", "Amsterdam"}
    };

    // Use AbstractMap by implementing entrySet()
    private static class FlyweightMap extends AbstractMap<String,String> {
        // Use Entry by implementing getKey() getValue() setValue()
        private static class Entry implements Map.Entry<String,String> {
            int index;
            Entry(int index) { this.index = index; }
            public boolean equals(Object o) {
                if(o instanceof String)
                    return DATA[index][0].equals(o);
                return false;
            }
            public String getKey() { return DATA[index][0]; }
            public String getValue() { return DATA[index][1]; }
            public String setValue(String value) {
                throw new UnsupportedOperationException("Read Only!");
            }
            public int hashCode() {
                return DATA[index][0].hashCode();
            }
        }
        // Use AbstractSet by implementing size() & iterator
        static class EntrySet extends AbstractSet<Map.Entry<String,String>> {
            private int size;
            EntrySet(int size) {
                if(size < 0)
                    this.size = 0;
                else if(size > DATA.length) {
                    this.size = DATA.length;
                }else {
                    this.size = size;
                }
            }
            public int size() { return size; }
            private class Iter implements Iterator<Map.Entry<String,String>> {
                private Entry entry = new Entry(-1);
                public boolean hasNext() {
                    return entry.index < size - 1;
                }
                public Map.Entry<String,String> next() {
                    entry.index++;
                    return entry;
                }
                public void remove() {
                    throw new UnsupportedOperationException();
                }
            }
            public Iterator<Map.Entry<String,String>> iterator() {
                return new Iter();
            }
        }
        private static Set<Map.Entry<String,String>> entries = new EntrySet(DATA.length);
        public Set<Map.Entry<String, String>> entrySet() {
            return entries;
        }
    }
    // Create a partial map of 'size' countries
    static Map<String,String> select(final int size) {
        return new FlyweightMap() {
            public Set<Map.Entry<String,String>> entrySet(int size) {
                return new EntrySet(size);
            }
        };
    }
    static Map<String,String> map = new FlyweightMap();
    public static Map<String,String> capitals() {
        return map;
    }
    public static Map<String,String> capitals(int size) {
        return select(size);
    }
    static List<String> names = new ArrayList<>(map.keySet());
    public static List<String> names() { return names; }
    public static List<String> names(int size) {
        return new ArrayList<>(select(size).keySet());
    }
}


public class Countries {
    public static final String[][] DATA = {
            {"CANADA", "Ottawa"}, {"UNITED STATES OF AMERICA", "Washington, D.C"},
            {"BRAZIL", "Brasilia"}, {"RUSSIA", "Moscow"},
            {"ITALY", "Rome"}, {"SPAIN", "Madrid"},
            {"CHINA", "Beijing"}, {"EGYPT", "Cairo"},
            {"JAPAN", "Tokyo"}, {"KOREA", "Seoul"},
            {"GERMANY", "Berlin"}, {"GREECE", "Athens"},
            {"FRANCE", "Paris"}, {"THE NETHERLANDS", "Amsterdam"}
    };

    // Use AbstractMap by implementing entrySet()
    private static class FlyweightMap extends AbstractMap<String,String> {
        // Use Entry by implementing getKey() getValue() setValue()
        private static class Entry implements Map.Entry<String,String> {
            int index;
            Entry(int index) { this.index = index; }
            public boolean equals(Object o) {
                if(o instanceof String)
                    return DATA[index][0].equals(o);
                return false;
            }
            public String getKey() { return DATA[index][0]; }
            public String getValue() { return DATA[index][1]; }
            public String setValue(String value) {
                throw new UnsupportedOperationException("Read Only!");
            }
            public int hashCode() {
                return DATA[index][0].hashCode();
            }
        }
        // Use AbstractSet by implementing size() & iterator
        static class EntrySet extends AbstractSet<Map.Entry<String,String>> {
            private int size;
            EntrySet(int size) {
                if(size < 0)
                    this.size = 0;
                else if(size > DATA.length) {
                    this.size = DATA.length;
                }else {
                    this.size = size;
                }
            }
            public int size() { return size; }
            private class Iter implements Iterator<Map.Entry<String,String>> {
                private Entry entry = new Entry(-1);
                public boolean hasNext() {
                    return entry.index < size - 1;
                }
                public Map.Entry<String,String> next() {
                    entry.index++;
                    return entry;
                }
                public void remove() {
                    throw new UnsupportedOperationException();
                }
            }
            public Iterator<Map.Entry<String,String>> iterator() {
                return new Iter();
            }
        }
        private static Set<Map.Entry<String,String>> entries = new EntrySet(DATA.length);
        public Set<Map.Entry<String, String>> entrySet() {
            return entries;
        }
    }
    // Create a partial map of 'size' countries
    static Map<String,String> select(final int size) {
        return new FlyweightMap() {
            public Set<Map.Entry<String,String>> entrySet(int size) {
                return new EntrySet(size);
            }
        };
    }
    static Map<String,String> map = new FlyweightMap();
    public static Map<String,String> capitals() {
        return map;
    }
    public static Map<String,String> capitals(int size) {
        return select(size);
    }
    static List<String> names = new ArrayList<>(map.keySet());
    public static List<String> names() { return names; }
    public static List<String> names(int size) {
        return new ArrayList<>(select(size).keySet());
    }
}
public class Countries {
    public static final String[][] DATA = {
            {"CANADA", "Ottawa"}, {"UNITED STATES OF AMERICA", "Washington, D.C"},
            {"BRAZIL", "Brasilia"}, {"RUSSIA", "Moscow"},
            {"ITALY", "Rome"}, {"SPAIN", "Madrid"},
            {"CHINA", "Beijing"}, {"EGYPT", "Cairo"},
            {"JAPAN", "Tokyo"}, {"KOREA", "Seoul"},
            {"GERMANY", "Berlin"}, {"GREECE", "Athens"},
            {"FRANCE", "Paris"}, {"THE NETHERLANDS", "Amsterdam"}
    };

    // Use AbstractMap by implementing entrySet()
    private static class FlyweightMap extends AbstractMap<String,String> {
        // Use Entry by implementing getKey() getValue() setValue()
        private static class Entry implements Map.Entry<String,String> {
            int index;
            Entry(int index) { this.index = index; }
            public boolean equals(Object o) {
                if(o instanceof String)
                    return DATA[index][0].equals(o);
                return false;
            }
            public String getKey() { return DATA[index][0]; }
            public String getValue() { return DATA[index][1]; }
            public String setValue(String value) {
                throw new UnsupportedOperationException("Read Only!");
            }
            public int hashCode() {
                return DATA[index][0].hashCode();
            }
        }
        // Use AbstractSet by implementing size() & iterator
        static class EntrySet extends AbstractSet<Map.Entry<String,String>> {
            private int size;
            EntrySet(int size) {
                if(size < 0)
                    this.size = 0;
                else if(size > DATA.length) {
                    this.size = DATA.length;
                }else {
                    this.size = size;
                }
            }
            public int size() { return size; }
            private class Iter implements Iterator<Map.Entry<String,String>> {
                private Entry entry = new Entry(-1);
                public boolean hasNext() {
                    return entry.index < size - 1;
                }
                public Map.Entry<String,String> next() {
                    entry.index++;
                    return entry;
                }
                public void remove() {
                    throw new UnsupportedOperationException();
                }
            }
            public Iterator<Map.Entry<String,String>> iterator() {
                return new Iter();
            }
        }
        private static Set<Map.Entry<String,String>> entries = new EntrySet(DATA.length);
        public Set<Map.Entry<String, String>> entrySet() {
            return entries;
        }
    }
    // Create a partial map of 'size' countries
    static Map<String,String> select(final int size) {
        return new FlyweightMap() {
            public Set<Map.Entry<String,String>> entrySet(int size) {
                return new EntrySet(size);
            }
        };
    }
    static Map<String,String> map = new FlyweightMap();
    public static Map<String,String> capitals() {
        return map;
    }
    public static Map<String,String> capitals(int size) {
        return select(size);
    }
    static List<String> names = new ArrayList<>(map.keySet());
    public static List<String> names() { return names; }
    public static List<String> names(int size) {
        return new ArrayList<>(select(size).keySet());
    }
}
```