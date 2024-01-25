---
dg-publish: true
---
### 配置阿里源
在 `build.gradle.kts` 文件中，使用阿里云的 Maven 镜像。确保在 `repositories` 部分添加以下内容：
```kotlin
repositories {
    maven { url = uri("https://maven.aliyun.com/repository/public") }
    // 其他 Maven 仓库配置...
}

```
like this
![[Pasted image 20240105121724.png]]
### 用图标替换按钮
```
implementation "androidx.compose.material:material-icons-extended:$compose_version"
```
$compose_version 可以在同文件下的
```
composeOptions {  
kotlinCompilerExtensionVersion = "1.5.1"  
}
```
中找到
### 调用` viewModel() `函数
打开 `app/build.gradle.kts` 文件，添加以下库，并在 Android Studio 中同步新的依赖项：
```
implementation("androidx.lifecycle:lifecycle-viewmodel-compose:{latest_version}")
```
