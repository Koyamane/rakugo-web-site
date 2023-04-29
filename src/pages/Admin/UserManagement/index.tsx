/*
 * @Author: dingyun
 * @Date: 2023-03-06 16:55:36
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-23 14:15:55
 * @Description:
 */
import { ACCESS, toObj } from '@/locales/dataDictionary'
import { formatTableParams } from '@/utils/tools'
import { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-form'
import type { ActionType, ProColumns } from '@ant-design/pro-table'
import ProTable from '@ant-design/pro-table'
import { NavLink } from '@umijs/max'
import { App, Form, Popconfirm } from 'antd'
import React, { useRef, useState } from 'react'
import { DeleteUserApi, UpdateUesrAccessApi, UserPageApi } from './service'

const UserManagement: React.FC = () => {
  const actionRef = useRef<ActionType>()
  const [form] = Form.useForm()
  const [modalVisible, handleModalVisible] = useState<boolean>(false)
  const { message } = App.useApp()

  const formatRequest = async (params: any, sort: any) => {
    const par = formatTableParams(params, sort, ['userId', 'access'], ['username', 'nickname'])

    const res = await UserPageApi(par)

    actionRef.current && actionRef.current.clearSelected && actionRef.current.clearSelected()

    return {
      data: res.list,
      // success 请返回 true，不然 table 会停止解析数据，即使有数据
      success: true,
      // 不传会使用 data 的长度，如果是分页一定要传
      total: res.total
    }
  }

  const handleClick = async (values: API.UserInfo) => {
    const hide = message.loading('正在修改')

    try {
      await UpdateUesrAccessApi(values)
      message.success('修改成功')
      actionRef && actionRef.current && actionRef.current.reload()
      handleModalVisible(false)
    } catch (error) {
      console.log(error)
    }
    hide()
  }

  const handleRemove = async (userId: API.UserInfo['userId']) => {
    const hide = message.loading('正在删除')

    try {
      await DeleteUserApi(userId)
      message.success('删除成功，即将刷新')
      actionRef.current?.reloadAndRest?.()
    } catch (error) {
      console.log(error)
    }
    hide()
  }

  const columns: ProColumns<API.UserInfo>[] = [
    {
      title: '用户ID',
      dataIndex: 'userId'
    },
    {
      title: '用户名',
      dataIndex: 'username',
      render: (value, record) => (
        <NavLink to={`/account/center/${record.userId}`}>{value as string}</NavLink>
      )
    },
    {
      title: '昵称',
      dataIndex: 'nickname'
    },
    {
      title: '权限',
      dataIndex: 'access',
      valueEnum: toObj(ACCESS)
    },
    {
      title: '创建时间',
      sorter: true,
      dataIndex: 'createdDate',
      valueType: 'dateTime',
      hideInForm: true,
      hideInSearch: true
    },
    {
      title: '更新时间',
      sorter: true,
      dataIndex: 'updateDate',
      valueType: 'dateTime',
      hideInForm: true,
      hideInSearch: true
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key='audit'
          onClick={() => {
            form.setFieldsValue({ ...record })
            handleModalVisible(true)
          }}
        >
          更改权限
        </a>,
        <Popconfirm
          key='delete'
          title='确定要删除该通知吗？'
          onConfirm={async () => handleRemove(record.userId)}
        >
          <a>删除</a>
        </Popconfirm>
      ]
    }
  ]

  return (
    <>
      <ProTable<API.UserInfo, API.TableListPagination>
        headerTitle='查询表格'
        actionRef={actionRef}
        rowKey='userId'
        pagination={{ pageSize: 10 }}
        request={formatRequest}
        columns={columns}
      />

      <ModalForm
        title='更改用户权限'
        form={form}
        onFinish={handleClick}
        open={modalVisible}
        onOpenChange={handleModalVisible}
      >
        <ProFormText hidden name='userId' label='用户ID' />
        <ProFormSelect name='access' label='权限' allowClear={false} options={ACCESS} />
      </ModalForm>
    </>
  )
}

export default UserManagement
