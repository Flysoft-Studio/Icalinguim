<template>
    <div id="login">
        <el-scrollbar>
            <el-form
                ref="loginForm"
                :model="form"
                :rules="rules"
                :hide-required-asterisk="true"
                :disabled="disabled"
                label-position="top"
                :style="{ padding: '20px' }"
            >
                <center>
                    <h1 :style="{ fontWeight: '300' }">
                        Icalinguim <span :style="{ fontSize: '10px', fontWeight: '500' }">{{ ver }}</span>
                    </h1>
                    <h4 v-if="$route.query.bridge === 'true'">正在配置 Bridge 服务器</h4>
                </center>
                <el-form-item prop="username" label="账号">
                    <el-input type="text" placeholder="用户 ID" v-model.number="form.username" />
                </el-form-item>
                <el-form-item prop="password" :style="{ marginBottom: '15px' }">
                    <el-input type="password" placeholder="密码" v-model="form.password" />
                </el-form-item>
                <el-form-item prop="autologin" class="nobottmar">
                    <span class="el-form-item__label">自动登录</span>
                    <el-switch v-model="form.autologin" :style="{ marginLeft: '5px' }" />
                </el-form-item>
                <el-form-item prop="protocol" label="协议">
                    <el-radio-group v-model="form.protocol" size="small">
                        <el-radio-button label="1">Android</el-radio-button>
                        <el-radio-button label="2">aPad</el-radio-button>
                        <el-radio-button label="3">Android Watch</el-radio-button>
                        <el-radio-button label="4">MacOS</el-radio-button>
                        <el-radio-button label="5">iPad</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="储存方式">
                    <el-select v-model="form.storageType">
                        <el-option label="SQLite (内置)" value="sqlite"></el-option>
                        <el-option label="MongoDB" value="mdb"></el-option>
                        <el-option label="Redis" value="redis"></el-option>
                        <el-option label="MySQL/MariaDB" value="mysql"></el-option>
                        <el-option label="PostgreSQL" value="pg"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="form.onlineStatus">
                        <el-option label="在线" :value="11"></el-option>
                        <el-option label="离开" :value="31"></el-option>
                        <el-option label="隐身" :value="41"></el-option>
                        <el-option label="忙碌" :value="50"></el-option>
                        <el-option label="Q我吧" :value="60"></el-option>
                        <el-option label="请勿打扰" :value="70"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="connStr" v-show="form.storageType === 'mdb'">
                    <el-input
                        :show-password="form.mdbConnStr && form.mdbConnStr.split(':').length > 2"
                        placeholder="MongoDB connect string"
                        v-model="form.mdbConnStr"
                    />
                </el-form-item>
                <el-form-item prop="rdsHost" v-show="form.storageType === 'redis'">
                    <el-input placeholder="Redis Host" v-model="form.rdsHost" />
                </el-form-item>
                <el-form-item prop="sqlHost" v-show="form.storageType === 'mysql' || form.storageType === 'pg'">
                    <el-input placeholder="Host" v-model="form.sqlHost" />
                </el-form-item>
                <el-form-item prop="sqlUsername" v-show="form.storageType === 'mysql' || form.storageType === 'pg'">
                    <el-input placeholder="username" v-model="form.sqlUsername" />
                </el-form-item>
                <el-form-item prop="sqlPassword" v-show="form.storageType === 'mysql' || form.storageType === 'pg'">
                    <el-input placeholder="password" type="password" v-model="form.sqlPassword" />
                </el-form-item>
                <el-form-item prop="sqlDatabase" v-show="form.storageType === 'mysql' || form.storageType === 'pg'">
                    <el-input placeholder="database" v-model="form.sqlDatabase" />
                </el-form-item>
                <p class="red">
                    {{ errmsg }}
                </p>
                <el-form-item align="center">
                    <el-button type="primary" v-on:click="onSubmit('loginForm')">
                        <span v-show="!form.password && $route.query.bridge !== 'true'">扫码</span>登录
                    </el-button>
                    <el-button type="warning" v-if="errmsg !== ''" v-on:click="cannotLogin"> 无法登录? </el-button>
                </el-form-item>
            </el-form>
        </el-scrollbar>

        <QrcodeDrawer @login="onSubmit('loginForm')" />
        <el-drawer
            title="短信验证"
            :visible="shouldSubmitSmsCode"
            direction="btt"
            :close-on-press-escape="false"
            :show-close="false"
            :wrapper-closable="false"
            :modal-append-to-body="false"
            size="50%"
        >
            <el-form :hide-required-asterisk="true" label-position="top" :style="{ padding: '20px' }">
                <el-form-item :label="phone ? (sendTime !== -1 ? '已' : '') + '向' + phone + '发送验证码' : ''">
                    <el-input placeholder="短信验证码" v-model="smsCode" @input="smsCode = smsCode.slice(0, 6)" />
                </el-form-item>
                <el-form-item align="center">
                    <el-button @click="submitSmsCode" type="primary" v-if="sendTime !== -1"> 提交 </el-button>
                    <el-button @click="sendSmsCode" v-if="sendTime === -1"> 发送验证码 </el-button>
                    <el-button @click="sendSmsCode" v-if="sendTime !== -1" :disabled="sendTime !== 0">
                        重发 ({{ sendTime }}s)
                    </el-button>
                    <el-button @click="QRCodeVerify"> 扫码验证 </el-button>
                </el-form-item>
            </el-form>
        </el-drawer>
    </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import ipc from '../utils/ipc'
import md5 from 'md5'
import QrcodeDrawer from '../components/QrcodeDrawer'

export default {
    name: 'LoginView',
    components: { QrcodeDrawer },
    data() {
        return {
            ver: '',
            /**
             * @type LoginForm
             */
            form: {},
            rules: {
                username: [{ required: true, trigger: 'blur' }],
            },
            disabled: false,
            errmsg: '',
            shouldSubmitSmsCode: false,
            smsCode: '',
            verifyUrl: '',
            phone: '',
            sendTime: -1,
        }
    },
    async created() {
        this.ver = await ipc.getVersion()
        this.form = await ipc.getAccount()
        ipcRenderer.on('error', (_, msg) => {
            this.errmsg = msg
            this.disabled = false
            this.shouldSubmitSmsCode = false
        })
        ipcRenderer.on('smsCodeVerify', (_, data) => {
            const parsed = JSON.parse(data)
            // console.log(parsed.url)
            this.shouldSubmitSmsCode = true
            this.verifyUrl = parsed.url
            this.phone = parsed.phone
        })
    },
    methods: {
        onSubmit(formName) {
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    this.disabled = true
                    if (this.form.password && !/^([a-f\d]{32}|[A-F\d]{32})$/.test(this.form.password))
                        this.form.password = md5(this.form.password)
                    await ipcRenderer.send('createBot', this.form)
                } else {
                    return false
                }
            })
        },
        submitSmsCode() {
            ipcRenderer.send('submitSmsCode', this.smsCode)
        },
        sendSmsCode() {
            ipcRenderer.send('submitSmsCode', 'sendSmsCode')
            this.sendTime = 60
            const timer = setInterval(() => {
                if (this.sendTime === 0) {
                    clearInterval(timer)
                    return
                }
                this.sendTime--
            }, 1000)
        },
        QRCodeVerify() {
            ipcRenderer.send('QRCodeVerify', this.verifyUrl)
        },
        cannotLogin() {
            this.$confirm(
                '无法登录有可能由风控造成，随机生成不同的设备消息或许可以解决，但也有可能造成更严重的风控，是否尝试随机生成?',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                },
            ).then(() => {
                ipcRenderer.send('randomDevice', this.form.username)
                this.$message({
                    type: 'success',
                    message: `已尝试随机生成 ${this.form.username} 的设备消息`,
                })
            })
        },
    },
}
</script>

<style lang="scss" scoped>
#login {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    height: 100%;
}

.red {
    color: red;
}

.nobottmar {
    margin-bottom: 0;
}

.notopmar {
    margin-top: 0;
}
</style>
