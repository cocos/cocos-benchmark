# Cocos Creator 3D Performance Tests

## 包含场景目录
1. lobby: 所有测试场景的入口
2. model-triangles: 测试静态模型三角面数
3. model-animation: 测试骨骼动画支持数量
4. physics-benchmark: 测试物理
5. particle-test: 测试粒子

## 添加新测试场景注意事项
1. 每个测试场景所包含的内容都放在自己的文件夹，如果需要resources，也需要在其中为自己单独建一个文件夹。
2. 在resources/lobby/projects.json中添加测试场景的信息，如下所示：
```json
    {
        "name": "particle-test",
        "sceneUrl": "particle-test/ParticleTest.scene",
        "coverImgUrl": "lobby/particle-test/spriteFrame",
        "tips": "用于粒子测试"
    }
```
