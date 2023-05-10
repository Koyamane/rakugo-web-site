/*
 * @Author: dingyun
 * @Date: 2023-03-06 16:55:36
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-05-10 16:03:30
 * @Description:
 */
import { NOTIFICATION_STATUS, BG_IMAGE_POSITION, toObj } from '@/locales/dataDictionary'
import { formatTableParams } from '@/utils/tools'
import { InputFileItem } from '@/components'
import { PlusOutlined } from '@ant-design/icons'
import { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-form'
import type { ActionType, ProColumns } from '@ant-design/pro-table'
import ProTable from '@ant-design/pro-table'
import { NavLink } from '@umijs/max'
import { App, Image, Button, Form, InputNumber, Popconfirm } from 'antd'
import React, { useRef, useState } from 'react'
import { BgImageInfo } from './data'
import { BgImageAddApi, BgImageDeleteApi, BgImagePageApi, BgImageUpdateApi } from './service'

const WebsiteBgManagement: React.FC = () => {
  const actionRef = useRef<ActionType>()
  const [form] = Form.useForm()
  const { message } = App.useApp()
  const [modalType, setModalType] = useState<'CREATE' | 'EDIT'>('CREATE')
  const [createModalVisible, handleModalVisible] = useState<boolean>(false)

  const formatRequest = async (params: any, sort: any) => {
    const par = formatTableParams(params, sort, ['status', 'order'], ['imgUrl', 'createdName'])

    const res = await BgImagePageApi(par)

    actionRef.current && actionRef.current.clearSelected && actionRef.current.clearSelected()

    return {
      data: res.list,
      // success 请返回 true，不然 table 会停止解析数据，即使有数据
      success: true,
      // 不传会使用 data 的长度，如果是分页一定要传
      total: res.total
    }
  }

  const handleAdd = async (values: BgImageInfo) => {
    const hide = message.loading('正在添加')

    try {
      await BgImageAddApi(values)
      message.success('添加成功')
      actionRef && actionRef.current && actionRef.current.reload()
      handleModalVisible(false)
    } catch (error) {
      console.log(error)
    }
    hide()
  }

  const handleEdit = async (values: BgImageInfo) => {
    const hide = message.loading('正在修改')

    try {
      await BgImageUpdateApi(values)
      message.success('修改成功')
      actionRef && actionRef.current && actionRef.current.reload()
      handleModalVisible(false)
    } catch (error) {
      console.log(error)
    }
    hide()
  }

  const handleRemove = async (id: BgImageInfo['id']) => {
    const hide = message.loading('正在删除')

    try {
      await BgImageDeleteApi(id)
      message.success('删除成功，即将刷新')
      actionRef.current?.reloadAndRest?.()
    } catch (error) {
      console.log(error)
    }
    hide()
  }

  const columns: ProColumns<BgImageInfo>[] = [
    {
      title: '排序',
      sorter: true,
      dataIndex: 'order'
    },
    {
      title: '背景图片',
      dataIndex: 'imgUrl',
      hideInSearch: true,
      render: value => (
        <Image style={{ maxWidth: '100%', maxHeight: '100px' }} src={value as string} />
      )
    },
    // {
    //   title: '图片地址',
    //   dataIndex: 'imgUrl',
    //   render: value => <span style={{ wordBreak: 'break-all' }}>{value}</span>
    // },
    {
      title: '背景所处位置',
      sorter: true,
      dataIndex: 'position',
      valueEnum: toObj(BG_IMAGE_POSITION)
    },
    {
      title: '状态',
      dataIndex: 'status',
      initialValue: 'NOT_EXPIRED',
      valueEnum: toObj(NOTIFICATION_STATUS)
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
            handleModalVisible(true)
          }}
        >
          编辑
        </a>,
        <Popconfirm
          key='delete'
          title='确定要删除该背景图片吗？'
          onConfirm={async () => handleRemove(record.id)}
        >
          <a>删除</a>
        </Popconfirm>
      ]
    }
  ]

  return (
    <>
      <ProTable<BgImageInfo, API.TableListPagination>
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
        columns={columns}
        request={formatRequest}
      />

      <ModalForm
        title={modalType === 'CREATE' ? '新增网站背景' : '编辑网站背景'}
        onFinish={value => {
          return modalType === 'CREATE' ? handleAdd(value) : handleEdit(value)
        }}
        form={form}
        layout='horizontal'
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        open={createModalVisible}
        onOpenChange={handleModalVisible}
      >
        <ProFormText hidden name='id' label='背景图片ID' />
        <Form.Item label='顺序' name='order' initialValue={1}>
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
          name='position'
          label='背景所处位置'
          allowClear={false}
          options={BG_IMAGE_POSITION}
          rules={[{ required: true, message: '请选择背景所处位置' }]}
        />

        <Form.Item
          name='imgUrl'
          label='背景图片'
          rules={[{ required: true, message: '请上传背景图片' }]}
        >
          <InputFileItem fileType='IMAGE' imageMode fileSize={2} />
        </Form.Item>
      </ModalForm>
    </>
  )
}

export default WebsiteBgManagement
