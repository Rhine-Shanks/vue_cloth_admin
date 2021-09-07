const { sequelize, DataTypes } = require('./connect')
const dayjs = require('dayjs')
const _ = require('lodash')
// 公共字段：
const common_fields = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    tenantId: DataTypes.STRING(20),
    createTime: {
        type: DataTypes.DATE,
        get() {
            return this.getDataValue('createTime') ? dayjs(this.getDataValue('createTime')).format('YYYY-MM-DD HH:mm:ss') : ''
        }
    },
    createPerson: DataTypes.STRING(50),
    updateTime: {
        type: DataTypes.DATE,
        get() {
            return this.getDataValue('updateTime') ? dayjs(this.getDataValue('updateTime')).format('YYYY-MM-DD HH:mm:ss') : ''
        }
    },
    updatePerson: DataTypes.STRING(50),
    remarks: DataTypes.STRING(200)
}

module.exports = {
    tenant_user: sequelize.define('tenant_user', Object.assign({
        orgId: DataTypes.STRING(20),
        employeeId: DataTypes.STRING(20),
        userId: DataTypes.STRING(20),
        password: DataTypes.STRING(50),
        status: DataTypes.INTEGER,
        latestLoginTime: DataTypes.DATE,
        loginCount: DataTypes.INTEGER,
        isDelete: DataTypes.INTEGER,
    }, common_fields), {
        initialAutoIncrement: 1,
        timestamps: false,
        tableName: 'tenant_user',
        indexes: [{
            unique: true,
            using: 'BTREE',
            name: 'idx_tenant_user',
            fields: ['tenantId', 'userId']
        }]
    }),
    tenant_user_role: sequelize.define('tenant_user_role', Object.assign({
        orgId: DataTypes.STRING(20),
        userId: DataTypes.STRING(20),
        roleId: DataTypes.STRING(50),
        isDelete: DataTypes.INTEGER,
    }, common_fields), {
        initialAutoIncrement: 1,
        timestamps: false,
        tableName: 'tenant_user_role',
        indexes: [{
            unique: true,
            using: 'BTREE',
            name: 'idx_tenant_user_role',
            fields: ['tenantId', 'userId', 'roleId']
        }]
    }),
    tenant_right: sequelize.define('tenant_right', Object.assign({
        orgId: DataTypes.STRING(20),
        rightId: DataTypes.STRING(20),
        rightName: DataTypes.STRING(50),
        rightDesc: DataTypes.STRING(50),
        parentId: DataTypes.STRING(20),
        level: DataTypes.STRING(20),
        order: DataTypes.STRING(20),
        path: DataTypes.STRING(20),
        isDelete: DataTypes.INTEGER,
    }, common_fields), {
        initialAutoIncrement: 1,
        timestamps: false,
        tableName: 'tenant_right',
        indexes: [{
            unique: true,
            fields: ['tenantId', 'rightId']
        }]
    }),
    tenant_employee: sequelize.define('tenant_employee', Object.assign({
        orgId: DataTypes.STRING(20),
        employeeId: DataTypes.STRING(20),
        employeeName: DataTypes.STRING(50),
        telNo: DataTypes.STRING(20),
        email: DataTypes.STRING(50),
        isDelete: DataTypes.INTEGER,
    }, common_fields), {
        initialAutoIncrement: 1,
        timestamps: false,
        tableName: 'tenant_employee',
        indexes: [{
            unique: true,
            fields: ['tenantId', 'employeeId']
        }]
    }),
    tenant_org: sequelize.define('tenant_org', Object.assign({
        orgId: DataTypes.STRING(20),
        orgName: DataTypes.STRING(50),
        parentId: DataTypes.STRING(20),
        level: DataTypes.STRING(20),
        isDelete: DataTypes.INTEGER,
    }, common_fields), {
        initialAutoIncrement: 1,
        timestamps: false,
        tableName: 'tenant_org',
        indexes: [{
            unique: true,
            fields: ['tenantId', 'orgId']
        }]
    }),
    tenant_role: sequelize.define('tenant_role', Object.assign({
        orgId: DataTypes.STRING(20),
        roleId: DataTypes.STRING(20),
        roleName: DataTypes.STRING(50),
        isDelete: DataTypes.INTEGER,
    }, common_fields), {
        initialAutoIncrement: 1,
        timestamps: false,
        tableName: 'tenant_role',
        indexes: [{
            unique: true,
            fields: ['tenantId', 'roleId']
        }]
    }),
    tenant_role_right: sequelize.define('tenant_role_right', Object.assign({
        orgId: DataTypes.STRING(20),
        roleId: DataTypes.STRING(20),
        rightId: DataTypes.STRING(20),
        isDelete: DataTypes.INTEGER,
    }, common_fields), {
        initialAutoIncrement: 1,
        timestamps: false,
        tableName: 'tenant_role_right',
        indexes: [{
            unique: true,
            fields: ['tenantId', 'roleId', 'rightId']
        }]
    }),
    tenant_warehouse: sequelize.define('tenant_warehouse', Object.assign({
        orgId: DataTypes.STRING(20),
        warehouseId: DataTypes.STRING(20),
        warehouseName: DataTypes.STRING(50),
        warehouseType: DataTypes.STRING(20),
        ip: DataTypes.STRING(50),
        port: DataTypes.STRING(50),
        isDelete: DataTypes.INTEGER,
    }, common_fields), {
        initialAutoIncrement: 1,
        timestamps: false,
        tableName: 'tenant_warehouse',
        indexes: [{
            unique: true,
            fields: ['tenantId', 'warehouseId']
        }]
    }),
    v_user_list: sequelize.define('v_user_list', Object.assign({
        tenantName: DataTypes.STRING(50),
        orgId: DataTypes.STRING(20),
        orgName: DataTypes.STRING(50),
        employeeId: DataTypes.STRING(20),
        employeeName: DataTypes.STRING(50),
        userId: DataTypes.STRING(20),
        password: DataTypes.STRING(50),
        status: DataTypes.INTEGER,
        latestLoginTime: {
            type: DataTypes.DATE,
            get() {
                return this.getDataValue('latestLoginTime') ? dayjs(this.getDataValue('latestLoginTime')).format('YYYY-MM-DD HH:mm:ss') : ''
            }
        },
        loginCount: DataTypes.INTEGER,
        roleId: DataTypes.STRING(20),
        roleName: DataTypes.STRING(50),
    }, common_fields), {
        timestamps: false,
        tableName: 'v_user_list'
    }),
    v_user_right: sequelize.define('v_user_right', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        tenantId: DataTypes.STRING(20),
        orgId: DataTypes.STRING(20),
        userId: DataTypes.STRING(20),
        roleId: DataTypes.STRING(20),
        rightId: DataTypes.STRING(20),
        rightName: DataTypes.STRING(50),
        rightDesc: DataTypes.STRING(50),
        parentId: DataTypes.STRING(20),
        level: DataTypes.STRING(20),
        order: DataTypes.STRING(20),
        path: DataTypes.STRING(20),
    }, {
        timestamps: false,
        tableName: 'v_user_right'
    }),
    v_right_list: sequelize.define('v_right_list', Object.assign({
        orgId: DataTypes.STRING(20),
        orgName: DataTypes.STRING(50),
        rightId: DataTypes.STRING(20),
        rightName: DataTypes.STRING(50),
        rightDesc: DataTypes.STRING(50),
        parentId: DataTypes.STRING(20),
        level: DataTypes.STRING(20),
        order: DataTypes.STRING(20),
        path: DataTypes.STRING(20),
    }, common_fields), {
        initialAutoIncrement: 1,
        timestamps: false,
        tableName: 'v_right_list'
    }),
    v_org_list: sequelize.define('v_org_list', {
        tenantId: DataTypes.STRING(20),
        orgId: DataTypes.STRING(20),
        orgName: DataTypes.STRING(50),
        parentId: DataTypes.STRING(20),
        level: DataTypes.STRING(20),
        createPerson: DataTypes.STRING(50),
        createTime: {
            type: DataTypes.DATE,
            get() {
                return dayjs(this.getDataValue('createTime')).format('YYYY-MM-DD HH:mm:ss')
            }
        },
    }, {
        timestamps: false,
        tableName: 'v_org_list'
    }),
    v_employee_list: sequelize.define('v_employee_list', Object.assign({
        orgId: DataTypes.STRING(20),
        orgName: DataTypes.STRING(50),
        employeeId: DataTypes.STRING(20),
        employeeName: DataTypes.STRING(50),
        telNo: DataTypes.STRING(50),
        email: DataTypes.STRING(50),
    }, common_fields), {
        timestamps: false,
        tableName: 'v_employee_list'
    }),
    v_role_list: sequelize.define('v_role_list', Object.assign({
        orgId: DataTypes.STRING(20),
        orgName: DataTypes.STRING(50),
        roleId: DataTypes.STRING(20),
        roleName: DataTypes.STRING(50),
    }, common_fields), {
        timestamps: false,
        tableName: 'v_role_list'
    }),
    v_role_right: sequelize.define('v_role_right', Object.assign({
        orgId: DataTypes.STRING(20),
        roleName: DataTypes.STRING(50),
        roleId: DataTypes.STRING(20),
        rightId: DataTypes.STRING(20),
        rightName: DataTypes.STRING(50),
        rightDesc: DataTypes.STRING(50),
        parentId: DataTypes.STRING(20),
        level: DataTypes.STRING(20),
        order: DataTypes.STRING(20),
        path: DataTypes.STRING(20),
    }, common_fields), {
        timestamps: false,
        tableName: 'v_role_right'
    }),
    v_warehouse_list: sequelize.define('v_warehouse_list', Object.assign({
        orgId: DataTypes.STRING(20),
        orgName: DataTypes.STRING(50),
        warehouseId: DataTypes.STRING(20),
        warehouseName: DataTypes.STRING(50),
        warehouseType: DataTypes.STRING(20),
        ip: DataTypes.STRING(50),
        port: DataTypes.STRING(50),
        isDelete: DataTypes.INTEGER,
    }, common_fields), {
        initialAutoIncrement: 1,
        timestamps: false,
        tableName: 'v_warehouse_list',
        indexes: [{
            unique: true,
            fields: ['tenantId', 'warehouseId']
        }]
    }),
}

