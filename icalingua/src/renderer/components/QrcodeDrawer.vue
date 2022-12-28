<template>
    <el-drawer
        title="二维码登录，扫码设备需与登录设备同一个网络"
        :visible="drawerVisible"
        direction="btt"
        :close-on-press-escape="false"
        :show-close="false"
        :wrapper-closable="false"
        :modal-append-to-body="false"
        size="8%"
    >
        <el-form :hide-required-asterisk="true" label-position="top" :style="{ padding: '20px' }">
            <el-form-item>
                <img :src="image" alt="" />
            </el-form-item>
            <el-form-item align="center">
                <el-button @click="$emit('login')" type="primary"> 已扫码 </el-button>
            </el-form-item>
        </el-form>
    </el-drawer>
</template>

<script>
import { ipcRenderer } from 'electron'
import ipc from '../utils/ipc'

export default {
    name: 'QrcodeDrawer',
    data() {
        return {
            drawerVisible: false,
            image: '',
        }
    },
    created() {
        ipcRenderer.on('qrcodeLogin', async (_, url) => {
            this.image = url
            this.drawerVisible = true
        })
    },
}
</script>
