### Git revert
```
git revert <commit id>
```

- 현재 커밋을 기준으로 특정 커밋에서 변경된 사항들을 제거
### git reset

```
git reset [옵션] <commit id>
```
- 되돌아간 commit 이후의 commit은 모두 삭제
- 3가지 옵션
    - --soft : 삭제된 commit의 기록을 staging area에 남김 
    - -- mixed 삭제된 commit의 기록을 working directory에 남김 (default)
    - --hard : 삭제된 commit의 기록을 남기지 않음

### git reflog
- HEAD가 이전에 가리켰던 모든 commit을 보여줌
- reset --hard 옵션을 통해 지워진 commit도 reflog로 조회하여 복구 가능

