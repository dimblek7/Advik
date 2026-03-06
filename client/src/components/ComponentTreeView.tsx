import { useState } from 'react'

interface Component {
  id: string
  name: string
  parent_id: string | null
  attributes: any
  media: any
  status: string
  created_at: string
  updated_at: string
}

interface ComponentTreeViewProps {
  components: Component[]
  onComponentSelect?: (component: Component) => void
  onEdit?: (component: Component) => void
  onDelete?: (component: Component) => void
}

interface TreeNode {
  component: Component
  children: TreeNode[]
  level: number
}

export default function ComponentTreeView({ components, onComponentSelect, onEdit, onDelete }: ComponentTreeViewProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())

  // Build tree structure from flat list
  const buildTree = (flatComponents: Component[]): TreeNode[] => {
    const nodeMap = new Map<string, TreeNode>()
    const rootNodes: TreeNode[] = []

    // Create all nodes
    flatComponents.forEach(comp => {
      nodeMap.set(comp.id, {
        component: comp,
        children: [],
        level: 0
      })
    })

    // Build hierarchy
    flatComponents.forEach(comp => {
      const node = nodeMap.get(comp.id)!
      if (comp.parent_id && nodeMap.has(comp.parent_id)) {
        const parent = nodeMap.get(comp.parent_id)!
        parent.children.push(node)
        node.level = parent.level + 1
      } else {
        rootNodes.push(node)
      }
    })

    return rootNodes
  }

  const tree = buildTree(components)

  const toggleExpand = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    setExpandedNodes(newExpanded)
  }

  const renderNode = (node: TreeNode) => {
    const hasChildren = node.children.length > 0
    const isExpanded = expandedNodes.has(node.component.id)
    const indent = node.level * 20

    return (
      <div key={node.component.id}>
        <div
          className="tree-node"
          style={{ paddingLeft: `${16 + indent}px` }}
          onClick={() => onComponentSelect?.(node.component)}
        >
          <span
            className={`tree-toggle ${hasChildren ? 'has-children' : ''}`}
            onClick={(e) => {
              e.stopPropagation()
              if (hasChildren) toggleExpand(node.component.id)
            }}
          >
            {hasChildren ? (isExpanded ? '▼' : '▶') : '·'}
          </span>
          <span className="tree-node-name">{node.component.name}</span>
          <span className="tree-node-status">
            <span className={`status-pill status-${node.component.status || 'draft'}`}>
              {node.component.status || 'draft'}
            </span>
          </span>
          <span className="tree-node-attrs">{Object.keys(node.component.attributes || {}).length} attrs</span>
          {onEdit && (
            <button
              className="secondary icon-btn tree-edit-btn"
              onClick={(e) => { e.stopPropagation(); onEdit(node.component) }}
              title="Edit"
            ><svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle' }}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
          )}
          {onDelete && (
            <button
              className="danger icon-btn tree-edit-btn"
              onClick={(e) => { e.stopPropagation(); onDelete(node.component) }}
              title="Delete"
            ><svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle' }}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg></button>
          )}
        </div>
        {hasChildren && isExpanded && (
          <div className="tree-children">
            {node.children.map(child => renderNode(child))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="component-tree">
      <div className="tree-header">
        <span>Component Name</span>
        <span>Status</span>
        <span>Attributes</span>
      </div>
      {tree.map(node => renderNode(node))}
    </div>
  )
}
