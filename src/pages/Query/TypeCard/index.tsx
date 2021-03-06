import React, { useState, useEffect } from 'react';
import { Tabs, Tag, List, Typography, Skeleton } from 'antd';
import './TypeCard.css'
import useService from '../services'
import qs from 'qs';
import { QueryParam } from '../../../types';
import {IExpert} from '../../../types';
import useRouter from 'use-react-router'
import { IPaperListItem } from '../../../types/response';


const { TabPane } = Tabs;

const { CheckableTag } = Tag;

function MyTag(props:{field:string, type:string}){
    const { getExperts, getPapers,setCurrentPage } = useService();



    const [checked, setChecked] = useState(false)

    const handleChange = (checked: any) => {
        setChecked(checked);
        if(props.type === "expert"){
            getExperts({
                page: 1,
                size: 10,
                domain: "tags",
                key: props.field,
                sort: 'n_citation',
                direction: true,
                free: true,
            });
            setCurrentPage(1)
        }else if(props.type === "paper"){
            getPapers({
                page: 1,
                size: 10,
                domain: "keywords",
                key: props.field,
                sort: 'n_citation',
                direction: true,
                free: true,
            });
            setCurrentPage(1)
        }
    };

    return (
        <div className="checkable-tag">
            <CheckableTag {...props} checked={checked} onChange={handleChange}>
                {props.field}
            </CheckableTag>
        </div>
    );
}

function HTag(){
    const [checked, setChecked] = useState(0)
    const { getExperts, getPapers, setCurrentPage } = useService();
    const { location } = useRouter();
    const param: QueryParam = qs.parse(location.search.slice(1));

  const handleHChange = (checked: any) => {
    getExperts({
        page: 1,
        size: 10,
        domain: "name",
        key: param.q,
        sort: 'name',
        direction: true,
        free: true,
    });
    setCurrentPage(1)
  };

  const handlePChange = (checked: any) => {
    getExperts({
        page: 1,
        size: 10,
        domain: "name",
        key: param.q,
        sort: 'n_citation',
        direction: true,
        free: true,
    });
    setCurrentPage(1)
  };

  return (
      <div>
          <CheckableTag  checked={checked === 1} onChange={handleHChange}>姓名</CheckableTag>
          <CheckableTag  checked={checked === 2} onChange={handlePChange}>被引数</CheckableTag>
      </div>
  )
}
function checkTag(tag: { t: string, w: number }){
    return tag.t.length <= 25
}


export interface TypeCardProps {
    setTab: (tab: string) => void;
    tab: string;
}

function TypeCard(props: TypeCardProps){

    const {experts, loading, papers, getExperts, expertsTotal} = useService();
    const { location } = useRouter();
    const { Paragraph } = Typography;

    const expertData = [
        <div className='condition'>
            <div className='condition-left'>领域:</div>
            <div className='condition-right'>
            <Paragraph ellipsis={{ rows: 1, expandable: true }}>
            { experts[0] === undefined ? []:
            experts.map((item: IExpert) => (
                item.tags !== null &&
                            item.tags.filter(checkTag).slice(0,item.tags.length >= 5 ? 5:item.tags.length).map((tag: { t: string, w: number }) => (
                                <MyTag field={tag.t} type='expert'/>
                            )) 
            ))}
            </Paragraph>
            </div>
        </div>,
        <div className='condition'>
        <div className='condition-left'>排序:</div>
        <div className='condition-right'>
            <HTag></HTag>    
        </div>
    </div>,
    ];

    const sourceData = [
        <div className='condition'>
            <div className='condition-left'>领域:</div>
            <div className='condition-right'>
            <Paragraph ellipsis={{ rows: 1, expandable: true }}>
            {papers.map((item: IPaperListItem) => (
                item.keywords !== null &&
                item.keywords.slice(0,item.keywords.length >= 5 ? 5:item.keywords.length).map((keyword) => (
                    <MyTag field={keyword} type='paper'/>
                )) 
            ))}
            </Paragraph>
            </div>
        </div>
    ]

    return (
        <div className='TypeCard'>
            <Tabs activeKey={props.tab} onChange={e=>props.setTab(e)} type="card">
                <TabPane tab="专家" key="1">
                <Skeleton loading={loading}>
                    <div>
                        <List
                            size="small"
                            bordered
                            dataSource={expertData}
                            renderItem={item => 
                            <List.Item>{item}</List.Item>
                        }
                        />
                    </div>
                    </Skeleton>
                </TabPane>
                <TabPane tab="资源" key="2">
                <Skeleton loading={loading}>
                    <div>
                        <List
                            size="small"
                            bordered
                            dataSource={sourceData}
                            renderItem={item => 
                            <List.Item>{item}</List.Item>}
                        />
                    </div>
                </Skeleton>
                </TabPane>
            </Tabs>
        </div>
    );
};

export default TypeCard;
