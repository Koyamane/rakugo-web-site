/*
 * @Author: dingyun
 * @Date: 2023-03-06 16:55:36
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-18 12:54:25
 * @Description:
 */
import { BLOG_STATUS, toObj } from '@/locales/dataDictionary'
import { formatTableParams } from '@/utils/tools'
import { ModalForm, ProFormSelect, ProFormTextArea } from '@ant-design/pro-form'
import type { ActionType, ProColumns } from '@ant-design/pro-table'
import ProTable from '@ant-design/pro-table'
import { NavLink } from '@umijs/max'
import { App, Form, Popconfirm } from 'antd'
import React, { useRef, useState } from 'react'
import { BlogPageApi, DeleteBlogApi, UpdateBlogStatusApi } from './service'

const BlogManagement: React.FC = () => {
  const actionRef = useRef<ActionType>()
  const [form] = Form.useForm()
  const { message } = App.useApp()
  const [isReject, setIsReject] = useState(false)
  const [modalVisible, handleModalVisible] = useState<boolean>(false)

  const formatRequest = async (params: any, sort: any) => {
    const curSrot = { ...sort }
    if (Object.keys(sort).length <= 0) {
      curSrot.approvedDate = 'descend'
    }

    const par = formatTableParams(params, curSrot, ['status'], ['title', 'createdName'])

    const msg = await BlogPageApi(par)

    actionRef.current && actionRef.current.clearSelected && actionRef.current.clearSelected()

    return {
      data: msg.list,
      // success 请返回 true，不然 table 会停止解析数据，即使有数据
      success: true,
      // 不传会使用 data 的长度，如果是分页一定要传
      total: msg.total
    }
  }

  const handleAudit = async (values: API.BlogInfo) => {
    const hide = message.loading('正在审核')

    try {
      await UpdateBlogStatusApi(values)
      message.success('审核成功')
      actionRef && actionRef.current && actionRef.current.reload()
      handleModalVisible(false)
    } catch (error) {
      console.log(error)
      message.error('审核失败，请重试')
    }
    hide()
  }

  const handleRemove = async (id: API.BlogInfo['id']) => {
    const hide = message.loading('正在删除')

    try {
      await DeleteBlogApi(id)
      message.success('删除成功，即将刷新')
      actionRef.current?.reloadAndRest?.()
    } catch (error) {
      message.error('删除失败，请重试')
    }
    hide()
  }

  const statusChange = (value: DataDictionary.BLOG_STATUS) => {
    setIsReject(value === 'REJECT')
  }

  const columns: ProColumns<API.BlogInfo>[] = [
    {
      title: '标题',
      dataIndex: 'title',
      render: (value, record) => <NavLink to={`/article/${record.id}`}>{value as string}</NavLink>
    },
    {
      title: '状态',
      dataIndex: 'status',
      initialValue: 'REVIEWED',
      valueEnum: toObj(BLOG_STATUS)
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
      title: '审核时间',
      sorter: true,
      dataIndex: 'approvedDate',
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
            form.setFieldsValue({ ...record, status: 'APPROVED' })
            handleModalVisible(true)
          }}
        >
          审核
        </a>,
        <Popconfirm
          key='delete'
          title='确定要删除该通知吗？'
          onConfirm={async () => handleRemove(record.id)}
        >
          <a>删除</a>
        </Popconfirm>
      ]
    }
  ]

  return (
    <>
      <ProTable<API.BlogInfo, API.TableListPagination>
        headerTitle='查询表格'
        actionRef={actionRef}
        rowKey='id'
        pagination={{ pageSize: 10 }}
        request={formatRequest}
        columns={columns}
      />

      <ModalForm
        title='博文审核'
        form={form}
        onFinish={handleAudit}
        open={modalVisible}
        onOpenChange={handleModalVisible}
      >
        <ProFormSelect hidden name='id' label='博文ID' />
        <ProFormSelect
          name='status'
          label='状态'
          fieldProps={{
            onChange: statusChange
          }}
          allowClear={false}
          options={BLOG_STATUS}
        />
        {isReject && (
          <ProFormTextArea
            name='rejectReason'
            label='驳回原因'
            rules={[
              {
                required: true,
                message: '驳回原因为必填项'
              }
            ]}
          />
        )}
      </ModalForm>
    </>
  )
}

export default BlogManagement
