/*
 * @Author: dingyun
 * @Date: 2023-03-06 16:55:36
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-18 14:09:29
 * @Description:
 */
import { ACCESS_RIGHTS, NOTIFICATION_STATUS, toObj } from '@/locales/dataDictionary'
import { formatTableParams } from '@/utils/tools'
import { PlusOutlined } from '@ant-design/icons'
import { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-form'
import type { ActionType, ProColumns } from '@ant-design/pro-table'
import ProTable from '@ant-design/pro-table'
import { NavLink } from '@umijs/max'
import { App, Button, Form, InputNumber, Popconfirm } from 'antd'
import React, { useRef, useState } from 'react'
import { AnnouncementInfo } from './data'
import {
  AnnouncementAddApi,
  AnnouncementDeleteApi,
  AnnouncementPageApi,
  AnnouncementUpdateApi
} from './service'

const AnnouncementManagement: React.FC = () => {
  const actionRef = useRef<ActionType>()
  const [form] = Form.useForm()
  const { message } = App.useApp()
  const [modalType, setModalType] = useState<'CREATE' | 'EDIT'>('CREATE')
  const [currentRow, setCurrentRow] = useState<AnnouncementInfo>()
  const [createModalVisible, handleModalVisible] = useState<boolean>(false)

  const formatRequest = async (params: any, sort: any) => {
    const par = formatTableParams(params, sort, ['status', 'access'], ['title', 'createdName'])

    const msg = await AnnouncementPageApi(par)

    actionRef.current && actionRef.current.clearSelected && actionRef.current.clearSelected()

    return {
      data: msg.list,
      // success 请返回 true，不然 table 会停止解析数据，即使有数据
      success: true,
      // 不传会使用 data 的长度，如果是分页一定要传
      total: msg.total
    }
  }

  const handleAdd = async (values: AnnouncementInfo) => {
    const hide = message.loading('正在添加')

    try {
      await AnnouncementAddApi(values)
      message.success('添加成功')
      actionRef && actionRef.current && actionRef.current.reload()
      handleModalVisible(false)
    } catch (error) {
      message.error('添加失败请重试！')
    }
    hide()
  }

  const handleEdit = async (values: AnnouncementInfo) => {
    const hide = message.loading('正在修改')

    try {
      await AnnouncementUpdateApi({ ...currentRow, ...values })
      message.success('修改成功')
      actionRef && actionRef.current && actionRef.current.reload()
      handleModalVisible(false)
    } catch (error) {
      message.error('修改失败请重试！')
    }
    hide()
  }

  const handleRemove = async (id: AnnouncementInfo['id']) => {
    const hide = message.loading('正在删除')

    try {
      await AnnouncementDeleteApi(id)
      message.success('删除成功，即将刷新')
      actionRef.current?.reloadAndRest?.()
    } catch (error) {
      message.error('删除失败，请重试')
    }
    hide()
  }

  const columns: ProColumns<AnnouncementInfo>[] = [
    {
      title: '排序',
      sorter: true,
      dataIndex: 'order'
    },
    {
      title: '公告内容',
      dataIndex: 'title'
    },
    {
      title: '状态',
      dataIndex: 'status',
      initialValue: 'NOT_EXPIRED',
      valueEnum: toObj(NOTIFICATION_STATUS)
    },
    {
      title: '观看权限',
      dataIndex: 'access',
      valueEnum: toObj(ACCESS_RIGHTS)
    },
    {
      title: '创建人',
      dataIndex: 'createdName',
      hideInForm: true,
      render: (value, record) => (
        <NavLink to={`/account/center/${record.createdId}`}>{value as string}</NavLink>
      )
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
          key='edit'
          onClick={() => {
            form.setFieldsValue({ ...record })
            setModalType('EDIT')
            setCurrentRow(record)
            handleModalVisible(true)
          }}
        >
          编辑
        </a>,
        <Popconfirm
          key='delete'
          title='确定要删除该公告吗？'
          onConfirm={async () => handleRemove(record.id)}
        >
          <a>删除</a>
        </Popconfirm>
      ]
    }
  ]

  return (
    <>
      <ProTable<AnnouncementInfo, API.TableListPagination>
        headerTitle='查询表格'
        actionRef={actionRef}
        rowKey='id'
        pagination={{ pageSize: 10 }}
        toolBarRender={() => [
          <Button
            type='primary'
            key='primary'
            onClick={() => {
              form.resetFields()
              setModalType('CREATE')
              handleModalVisible(true)
            }}
          >
            <PlusOutlined /> 新建
          </Button>
        ]}
        request={formatRequest}
        columns={columns}
      />

      <ModalForm
        title={modalType === 'CREATE' ? '新增公告' : '编辑公告'}
        onFinish={value => {
          return modalType === 'CREATE' ? handleAdd(value) : handleEdit(value)
        }}
        form={form}
        open={createModalVisible}
        onOpenChange={handleModalVisible}
      >
        <ProFormText
          name='title'
          label='公告内容'
          rules={[
            {
              required: true,
              message: '公告内容为必填项'
            }
          ]}
        />
        <Form.Item label='公告顺序' name='order' initialValue={1}>
          <InputNumber
            min={1}
            style={{ width: '100%' }}
            parser={(value: any) => value.replace(/\D/g, '')}
            formatter={(value: any) => value.replace(/\D/g, '')}
          />
        </Form.Item>
        <ProFormSelect
          name='status'
          label='状态'
          allowClear={false}
          initialValue='NOT_EXPIRED'
          options={NOTIFICATION_STATUS}
        />
        <ProFormSelect
          name='access'
          label='观看权限'
          allowClear={false}
          initialValue='all'
          options={ACCESS_RIGHTS}
        />
      </ModalForm>
    </>
  )
}

export default AnnouncementManagement
