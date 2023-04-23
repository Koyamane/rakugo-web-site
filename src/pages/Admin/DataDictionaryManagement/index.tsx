/*
 * @Author: dingyun
 * @Date: 2023-03-06 16:55:36
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-23 14:16:01
 * @Description:
 */
import { DATA_DICTIONARY_STATUS, toObj } from '@/locales/dataDictionary'
import { formatTableParams } from '@/utils/tools'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { ProFormText } from '@ant-design/pro-components'
import { ModalForm, ProFormSelect } from '@ant-design/pro-form'
import type { ActionType, ProColumns } from '@ant-design/pro-table'
import ProTable from '@ant-design/pro-table'
import { App, Button, Col, Form, InputNumber, Popconfirm, Row, Space } from 'antd'
import React, { useMemo, useRef, useState } from 'react'
import {
  DataDictionaryAddApi,
  DataDictionaryDeleteApi,
  DataDictionaryPageApi,
  DataDictionaryUpdateApi
} from './service'

const DataDictionaryManagement: React.FC = () => {
  const actionRef = useRef<ActionType>()
  const [form] = Form.useForm()
  const { message } = App.useApp()
  const [currentRow, setCurrentRow] = useState<API.DataDictionaryInfo>()
  const [modalType, setModalType] = useState<'CREATE' | 'EDIT' | 'DETAIL'>('CREATE')
  const [modalVisible, handleModalVisible] = useState<boolean>(false)
  const modalTitle = useMemo(() => {
    switch (modalType) {
      case 'CREATE':
        return '新增数据字典'
      case 'EDIT':
        return '编辑数据字典'
      case 'DETAIL':
        return '数据字典详情'
      default:
        return '数据字典详情'
    }
  }, [modalType])

  const formatRequest = async (params: any, sort: any) => {
    const par = formatTableParams(
      params,
      sort,
      ['status'],
      ['key', 'title', 'description', 'createdName']
    )

    const res = await DataDictionaryPageApi(par)

    actionRef.current && actionRef.current.clearSelected && actionRef.current.clearSelected()

    return {
      data: res.list,
      // success 请返回 true，不然 table 会停止解析数据，即使有数据
      success: true,
      // 不传会使用 data 的长度，如果是分页一定要传
      total: res.total
    }
  }

  const addData = async (values: API.DataDictionaryInfo) => {
    const hide = message.loading('新增中……')

    try {
      await DataDictionaryAddApi(values)
      message.success('新增成功')
      actionRef && actionRef.current && actionRef.current.reload()
      handleModalVisible(false)
    } catch (error) {
      console.log(error)
    }
    hide()
  }

  const updateData = async (values: API.DataDictionaryInfo) => {
    const hide = message.loading('修改中……')

    try {
      await DataDictionaryUpdateApi({ ...currentRow, ...values })
      message.success('修改成功')
      actionRef && actionRef.current && actionRef.current.reload()
      handleModalVisible(false)
    } catch (error) {
      console.log(error)
    }
    hide()
  }

  const handleRemove = async (id: API.DataDictionaryInfo['id']) => {
    const hide = message.loading('正在删除')

    try {
      await DataDictionaryDeleteApi(id)
      message.success('删除成功，即将刷新')
      actionRef.current?.reloadAndRest?.()
    } catch (error) {
      console.log(error)
    }
    hide()
  }

  const columns: ProColumns<API.DataDictionaryInfo>[] = [
    {
      title: '键',
      dataIndex: 'key',
      render: (value, record) => (
        <a
          key='audit'
          onClick={() => {
            setModalType('DETAIL')
            form.setFieldsValue({ ...record })
            handleModalVisible(true)
          }}
        >
          {value}
        </a>
      )
    },
    {
      title: '标题',
      dataIndex: 'title'
    },
    {
      title: '描述',
      dataIndex: 'description'
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: toObj(DATA_DICTIONARY_STATUS)
    },
    {
      title: '值',
      dataIndex: 'datas',
      hideInForm: true,
      hideInSearch: true,
      render: datas =>
        (datas as [])?.reduce((pre: any, next: any) => {
          return pre ? pre + ', ' + next.value : next.value
        }, '')
    },
    {
      title: '创建人',
      dataIndex: 'createdName'
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
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key='audit'
          onClick={() => {
            setModalType('EDIT')
            setCurrentRow(record)
            form.setFieldsValue({ ...record })
            handleModalVisible(true)
          }}
        >
          编辑
        </a>,
        <Popconfirm
          key='delete'
          title='确定要删除吗？'
          onConfirm={async () => handleRemove(record.id)}
        >
          <a>删除</a>
        </Popconfirm>
      ]
    }
  ]

  return (
    <>
      <ProTable<API.DataDictionaryInfo, API.TableListPagination>
        rowKey='id'
        columns={columns}
        headerTitle='查询表格'
        actionRef={actionRef}
        request={formatRequest}
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
      />

      <ModalForm
        form={form}
        width={1000}
        title={modalTitle}
        open={modalVisible}
        disabled={modalType === 'DETAIL'}
        onOpenChange={handleModalVisible}
        onFinish={value => {
          return modalType === 'CREATE' ? addData(value) : updateData(value)
        }}
      >
        <Row gutter={24}>
          <Col sm={12} xs={24}>
            <ProFormText name='title' label='标题' rules={[{ required: true }]} />
          </Col>
          <Col sm={12} xs={24}>
            <ProFormText name='key' label='键' rules={[{ required: true }]} />
          </Col>
          <Col sm={12} xs={24}>
            <ProFormSelect
              name='status'
              label='状态'
              initialValue='EFFECTIVE'
              allowClear={false}
              options={DATA_DICTIONARY_STATUS}
            />
          </Col>
          <Col sm={12} xs={24}>
            <ProFormText name='description' label='描述' />
          </Col>
        </Row>

        <Row gutter={24}>
          <Form.List name='datas' initialValue={[]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Col span={24} key={key}>
                    <Space align='baseline'>
                      <Form.Item
                        initialValue={key + 1}
                        name={[name, 'order']}
                        rules={[{ required: true }]}
                        style={{ transform: 'translateY(-4px)' }}
                      >
                        <InputNumber
                          min={1}
                          placeholder='顺序'
                          parser={(value: any) => value.replace(/\D/g, '')}
                          formatter={(value: any) => value.replace(/\D/g, '')}
                        />
                      </Form.Item>
                      <ProFormText
                        {...restField}
                        placeholder='键'
                        name={[name, 'key']}
                        rules={[{ required: true }]}
                      />
                      <ProFormText {...restField} placeholder='默认值' name={[name, 'value']} />
                      <ProFormText {...restField} placeholder='中文值' name={[name, 'value_zh']} />
                      <ProFormText {...restField} placeholder='英文值' name={[name, 'value_en']} />
                      <ProFormText {...restField} placeholder='日文值' name={[name, 'value_ja']} />
                      <Button
                        type='text'
                        onClick={() => remove(name)}
                        icon={<MinusCircleOutlined />}
                      />
                    </Space>
                  </Col>
                ))}

                <Col span={24}>
                  <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                    新增字典内容
                  </Button>
                </Col>
              </>
            )}
          </Form.List>
        </Row>
      </ModalForm>
    </>
  )
}

export default DataDictionaryManagement
