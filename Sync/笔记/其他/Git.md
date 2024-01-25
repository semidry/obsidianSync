![[Pasted image 20240112112117.png]]
### 理解 git 工作区域
根据 git 的几个文件存储区域，git 的工作区域可以划分为 4 个：
- 工作区：你在本地编辑器里改动的代码，所见即所得，里面的内容都是最新的
- 暂存区：通过 `git add` 指令，会将你工作区改动的代码提交到暂存区里
- 本地仓库：通过 `git commit` 指令，会将暂存区变动的代码提交到本地仓库中，本地仓库位于你的电脑上
- 远程仓库：远端用来托管代码的仓库，通过 `git push` 指令，会将本地仓库的代码推送到远程仓库中

![[Pasted image 20240112105309.png]]
### git clone: 克隆仓库
```
# 克隆远端仓库到本地
git clone <git url>

# 克隆远端仓库到本地，并同时切换到指定分支 branch1
git clone <git url> -b branch1

# 克隆远端仓库到本地并指定本地仓库的文件夹名称为 my-project
git clone <git url> my-project

```
### git add: 提交到暂存区

工作区提交到暂存区，用到的指令为 `git add`：
```
# 将所有修改的文件都提交到暂存区
git add .

# 将修改的文件中的指定的文件 a.js 和 b.js 提交到暂存区
git add ./a.js ./b.js

# 将 js 文件夹下修改的内容提交到暂存区
git add ./js

```
### git commit: 提交到本地仓库

将工作区内容提交到本地仓库所用到的指令为 `git commit`：
```
# 将工作区内容提交到本地仓库，并添加提交信息 your commit message
git commit -m "your commit message"

# 将工作区内容提交到本地仓库，并对上一次 commit 记录进行覆盖
## 例如先执行 git commit -m "commit1" 提交了文件a，commit_sha为hash1；再执行 git commit -m "commit2" --amend 提交文件b，commit_sha为hash2。最终显示的是a，b文件的 commit 信息都是 "commit2"，commit_sha都是hash2
git commit -m "new message" --amend

# 将工作区内容提交到本地仓库，并跳过 commit 信息填写
## 例如先执行 git commit -m "commit1" 提交了文件a，commit_sha为hash1；再执行 git commit --amend --no-edit 提交文件b，commit_sha为hash2。最终显示的是a，b文件的 commit 信息都是 "commit1"，commit_sha都是hash1
git commit --amend --no-edit

# 跳过校验直接提交，很多项目配置 git hooks 验证代码是否符合 eslint、husky 等规则，校验不通过无法提交
## 通过 --no-verify 可以跳过校验（为了保证代码质量不建议此操作QwQ）
git commit --no-verify -m "commit message"

# 一次性从工作区提交到本地仓库，相当于 git add . + git commit -m
git commit -am

```
### git push: 提交到远程仓库

`git push` 会将本地仓库的内容推送到远程仓库
```
# 将当前本地分支 branch1 内容推送到远程分支 origin/branch1
git push

# 若当前本地分支 branch1，没有对应的远程分支 origin/branch1，需要为推送当前分支并建立与远程上游的跟踪
git push --set-upstream origin branch1

# 强制提交
## 例如用在代码回滚后内容
git push -f

```
### git pull: 拉取远程仓库并合并

`git pull` 会拉取远程仓库并合并到本地仓库，相当于执行 `git fetch` + `git merge`
```# 若拉取并合并的远程分支和当前本地分支名称一致
## 例如当前本地分支为 branch1，要拉取并合并 origin/branch1，则直接执行：
git pull

# 若拉取并合并的远程分支和当前本地分支名称不一致
git pull <远程主机名> <分支名>
## 例如当前本地分支为 branch2，要拉取并合并 origin/branch1，则执行：
git pull git@github.com:zh-lx/git-practice.git branch1

# 使用 rebase 模式进行合并
git pull --rebase

```
### git checkout: 切换分支

`git checkout` 用于切换分支及撤销工作区内容的修改
```
# 切换到已有的本地分支 branch1
git checkout branch1

# 切换到远程分支 branch1
git checkout origin/branch1

# 基于当前本地分支创建一个新分支 branch2，并切换至 branch2
git checkout -b branch2

# 基于远程分支 branch1 创建一个新分支 branch2，并切换至 branch2
git checkout origin/branch1 -b branch2
## 当前创建的 branch2 关联的上游分支是 origin/branch1，所以 push 时需要如下命令关联到远程 branch2
git push --set-upstream origin branch2

# 撤销工作区 file 内容的修改。危险操作，谨慎使用
git checkout -- <file>

# 撤销工作区所有内容的修改。危险操作，谨慎使用
git checkout .

```
### git restore: 取消缓存

`git restore` 用于将改动从暂存区退回工作区
```
# 将 a.js 文件取消缓存（取消 add 操作，不改变文件内容）
git reset --staged a.js

# 将所有文件取消缓存
git reset --staged .

```
### git reset: 回滚代码

`git reset` 用于撤销各种 commit 操作，回滚代码
```

# 将某个版本的 commit 从本地仓库退回到工作区（取消 commit 和 add 操作，不改变文件内容）
## 默认不加 -- 参数时时 mixed
git reset --mixed <commit_sha>

# 将某个版本的 commit 从本地仓库退回到缓存区（取消 commit 操作，不取消 add，不改变文件内容）
git reset --soft <commit_sha>

# 取消某次 commit 的记录（取消 commit 和 add，且改变文件内容）
git reset --hard <commit_sha>

## 以上三种操作退回了 commit，都是退回本地仓库的 commit，没有改变远程仓库的 commit。通常再次修改后配合如下命令覆盖远程仓库的 commit：
git push -f

```

